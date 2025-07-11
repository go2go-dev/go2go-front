import * as Checkbox from '@radix-ui/react-checkbox';
import { TimerIcon, Trash2 } from 'lucide-react';
import { CheckIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { motion, useMotionValue, useAnimation, type PanInfo, AnimatePresence } from 'framer-motion';
import { useDeleteTodo } from '@/hooks/useDeleteTodo';
import { useToggleTodo } from '@/hooks/useToggleTodo';

interface TodoItemProps {
  todoId: number;
  text: string;
  isChecked?: boolean;
  isTag?: boolean;
  timerName?: string;
  onDelete?: () => void;
}

export default function TodoItem({
  todoId,
  text,
  isChecked = false,
  isTag = false,
  timerName,
  onDelete,
}: TodoItemProps) {
  const [checked, setChecked] = useState(isChecked);
  const [isSwiped, setIsSwiped] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const x = useMotionValue(0);
  const controls = useAnimation();
  const deleteTodoMutation = useDeleteTodo();
  const toggleTodoMutation = useToggleTodo();

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -60) {
      setIsSwiped(true);
      controls.start({ x: -80 });
    } else {
      setIsSwiped(false);
      controls.start({ x: 0 });
    }
  };

  const handleResetSwipe = () => {
    setIsSwiped(false);
    controls.start({ x: 0 });
  };

  const handleDelete = async () => {
    // 삭제 애니메이션 시작
    setIsDeleting(true);

    // 약간의 지연 후 실제 삭제 API 호출
    setTimeout(() => {
      deleteTodoMutation.mutate(todoId);
      onDelete?.();
    }, 400); // 애니메이션 시간과 맞춤
  };

  const handleToggleCheck = (newChecked: boolean) => {
    // 즉시 UI 업데이트 (낙관적 업데이트)
    setChecked(newChecked);

    // API 호출
    toggleTodoMutation.mutate(todoId, {
      onError: () => {
        // 실패 시 이전 상태로 되돌리기
        setChecked(!newChecked);
      },
    });
  };

  return (
    <AnimatePresence mode="wait">
      {!isDeleting ? (
        <motion.div
          key={todoId}
          initial={{ opacity: 1, scale: 1, height: 'auto' }}
          exit={{
            opacity: 0,
            scale: 0.8,
            height: 0,
            marginBottom: 0,
            transition: {
              duration: 0.4,
              ease: 'easeInOut',
            },
          }}
          className="relative w-full h-auto"
          layout
        >
          {/* 삭제 버튼 (배경 레이어) */}
          <div className="absolute inset-0 flex justify-end items-center pr-4 z-0">
            {isSwiped && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDelete}
                className="bg-red text-white w-10 h-10 rounded-lg flex items-center justify-center"
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            )}
          </div>

          {/* 할일 카드 (포그라운드) */}
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            style={{ x }}
            animate={controls}
            onDragEnd={handleDragEnd}
            className={`relative z-10 flex items-start gap-2 p-3 rounded-lg bg-white transition-colors ${
              checked ? 'text-gray-400 line-through' : ''
            }`}
            onClick={isSwiped ? handleResetSwipe : undefined}
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Checkbox.Root
              className="w-5 h-5 min-w-5 min-h-5 rounded-md flex items-center justify-center
                bg-gray-200 data-[state=checked]:bg-[#23263B]
                appearance-none outline-none border-none transition-colors relative"
              checked={checked}
              onCheckedChange={(v) => handleToggleCheck(!!v)}
              id={text}
            >
              <Checkbox.Indicator>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, delay: 0.1 }}
                >
                  <CheckIcon className="w-4 h-4 text-white" />
                </motion.div>
              </Checkbox.Indicator>
            </Checkbox.Root>

            <div className="text-sm flex-1 whitespace-pre-wrap">
              {isTag && timerName && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center mb-0.5"
                >
                  <TimerIcon className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-400 mr-1">{timerName}</span>
                </motion.div>
              )}
              <span>{text}</span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
