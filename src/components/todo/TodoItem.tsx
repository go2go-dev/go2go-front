import * as Checkbox from '@radix-ui/react-checkbox';
import { TimerIcon } from 'lucide-react';
import { CheckIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

interface TodoItemProps {
  text: string;
  isChecked?: boolean;
  isTag?: boolean;
}

export default function TodoItem({ text, isChecked = false, isTag = false }: TodoItemProps) {
  const [checked, setChecked] = useState(isChecked);

  return (
    <div
      className={`flex items-start gap-2 p-3 rounded-lg ${
        checked ? 'bg-gray-100 text-gray-400 line-through' : 'bg-gray-100'
      }`}
    >
      <Checkbox.Root
        className={`
		w-5 h-5 min-w-5 min-h-5
		rounded-md flex items-center justify-center
		bg-gray-200 data-[state=checked]:bg-[#23263B]
		appearance-none outline-none border-none
		transition-colors relative
	`}
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
    </div>
  );
}
