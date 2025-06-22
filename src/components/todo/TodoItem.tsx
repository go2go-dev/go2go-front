import * as Checkbox from '@radix-ui/react-checkbox';
import { TimerIcon, Trash2 } from 'lucide-react';
import { CheckIcon } from '@radix-ui/react-icons';
import { useState, useRef } from 'react';
import { motion, type PanInfo } from 'framer-motion';

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
  const itemRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -100) {
      // onDelete가 있으면 호출
      onDelete?.();
    }
  };

  return (
    <div className="relative w-full">
      <motion.div
        className="absolute inset-y-0 right-0 flex items-center justify-center bg-red-500 rounded-lg w-20"
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <Trash2 className="text-white" />
      </motion.div>
      <motion.div
        ref={itemRef}
        drag="x"
        dragConstraints={{ left: -80, right: 0 }}
        onDragEnd={handleDragEnd}
        className={`relative flex items-start gap-2 p-3 rounded-lg z-10 ${
          checked ? 'bg-gray-100 text-gray-400 line-through' : 'bg-gray-100'
        }`}
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
        <div className="text-sm flex-1">
          <div className="flex flex-col whitespace-pre-wrap">
            {isTag && (
              <div className="flex items-center mb-0.5">
                <TimerIcon className="w-4 h-4 text-gray-400 mr-1" />
                <span className="text-xs text-gray-400 mr-1">운동하기</span>
              </div>
            )}
            <span>{text}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
