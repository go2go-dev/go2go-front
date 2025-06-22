import * as Checkbox from '@radix-ui/react-checkbox';
import { TimerIcon, Trash2 } from 'lucide-react';
import { CheckIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { motion, useMotionValue, useAnimation, type PanInfo } from 'framer-motion';

interface TodoItemProps {
  text: string;
  isChecked?: boolean;
  isTag?: boolean;
  onDelete?: () => void;
}

export default function TodoItem({
  text,
  isChecked = false,
  isTag = false,
  onDelete,
}: TodoItemProps) {
  const [checked, setChecked] = useState(isChecked);
  const [isSwiped, setIsSwiped] = useState(false);
  const x = useMotionValue(0);
  const controls = useAnimation();

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -60) {
      setIsSwiped(true);
      controls.start({ x: -80 }); // 밀었을 때 고정
    } else {
      setIsSwiped(false);
      controls.start({ x: 0 });
    }
  };

  const handleResetSwipe = () => {
    setIsSwiped(false);
    controls.start({ x: 0 });
  };

  return (
    <div className="relative w-full h-auto">
      {/* 삭제 버튼 (배경 레이어) */}
      <div className="absolute inset-0 flex justify-end items-center pr-4 z-0">
        {isSwiped && (
          <button
            onClick={onDelete}
            className="bg-red text-white w-10 h-10 rounded-lg flex items-center justify-center"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 할일 카드 (포그라운드) */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x }}
        animate={controls}
        onDragEnd={handleDragEnd}
        className={`relative z-10 flex items-start gap-2 p-3 rounded-lg bg-gray-100 transition-colors ${
          checked ? 'text-gray-400 line-through' : ''
        }`}
        onClick={isSwiped ? handleResetSwipe : undefined}
      >
        <Checkbox.Root
          className="w-5 h-5 min-w-5 min-h-5 rounded-md flex items-center justify-center
            bg-gray-200 data-[state=checked]:bg-[#23263B]
            appearance-none outline-none border-none transition-colors relative"
          checked={checked}
          onCheckedChange={(v) => setChecked(!!v)}
          id={text}
        >
          <Checkbox.Indicator>
            <CheckIcon className="w-4 h-4 text-white" />
          </Checkbox.Indicator>
        </Checkbox.Root>

        <div className="text-sm flex-1 whitespace-pre-wrap">
          {isTag && (
            <div className="flex items-center mb-0.5">
              <TimerIcon className="w-4 h-4 text-gray-400 mr-1" />
              <span className="text-xs text-gray-400 mr-1">운동하기</span>
            </div>
          )}
          <span>{text}</span>
        </div>
      </motion.div>
    </div>
  );
}
