import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import CharacterSVG from '@/assets/svg/todoTimer.svg?react';

interface TodoInputBarProps {
  onClose?: () => void;
  onSubmit?: (content: string, timerId?: number) => void;
  timers: { timerId: number; name: string }[] | undefined;
}

export default function TodoInputBar({ onClose, onSubmit, timers }: TodoInputBarProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedTimerId, setSelectedTimerId] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = () => {
    if (!inputValue.trim()) return;

    onSubmit?.(inputValue.trim(), selectedTimerId || undefined);
    setInputValue('');
    setSelectedTimerId(null);
    setChecked(false);
    onClose?.();
  };

  // ✅ 타이머 선택 시 키보드 유지
  const handleTimerSelect = (timerId: number, event: React.MouseEvent) => {
    // 기본 동작 방지 (포커스 이동 방지)
    event.preventDefault();
    event.stopPropagation();

    setSelectedTimerId(timerId);

    // input 포커스 즉시 복원
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="mb-4"
        ref={containerRef}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.2 }}
          className={`flex items-start gap-2 p-3 rounded-lg bg-white transition-colors ${
            checked ? 'text-gray-400 line-through' : ''
          }`}
        >
          <Checkbox.Root
            className="w-5 h-5 min-w-5 min-h-5 rounded-md flex items-center justify-center
              bg-gray-200 data-[state=checked]:bg-[#23263B]
              appearance-none outline-none border-none transition-colors relative"
            checked={checked}
            onCheckedChange={(v) => setChecked(!!v)}
            id="todo-input"
          >
            <Checkbox.Indicator>
              <CheckIcon className="w-4 h-4 text-white" />
            </Checkbox.Indicator>
          </Checkbox.Root>

          <div className="text-sm flex-1 whitespace-pre-wrap">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="할 일을 적어주세요"
              className="w-full text-base focus:text-base border-0 outline-none bg-transparent placeholder-gray-400"
              // ✅ 키보드 "완료" 버튼 제거 및 키보드 최적화
              inputMode="text"
              enterKeyHint="done"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault(); // 기본 엔터 동작 방지
                  handleSubmit();
                }
                if (e.key === 'Escape') {
                  onClose?.();
                }
              }}
              // ✅ blur 방지 강화
              onBlur={(e) => {
                // 타이머 버튼이나 다른 내부 요소 클릭으로 인한 blur 방지
                const relatedTarget = e.relatedTarget as HTMLElement;
                if (!relatedTarget || containerRef.current?.contains(relatedTarget)) {
                  // 컨테이너 내부 클릭이면 포커스 유지
                  requestAnimationFrame(() => {
                    inputRef.current?.focus();
                  });
                }
              }}
            />
          </div>
        </motion.div>

        {/* 타이머 태그들 */}
        {Array.isArray(timers) && timers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.2 }}
            className="mt-3"
          >
            <div
              className="flex gap-2 overflow-x-auto hide-scrollbar"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {timers.map((timer, index) => (
                <motion.button
                  key={timer.timerId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: 0.3 + index * 0.05,
                    duration: 0.2,
                  }}
                  whileTap={{ scale: 0.95 }}
                  // ✅ 키보드 유지를 위한 이벤트 처리
                  onMouseDown={(e) => {
                    e.preventDefault(); // 기본 포커스 이동 방지
                  }}
                  onClick={(e) => handleTimerSelect(timer.timerId, e)}
                  // ✅ 탭 포커스 방지
                  tabIndex={-1}
                  type="button"
                  className={`min-w-fit px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-200 ${
                    selectedTimerId === timer.timerId
                      ? 'bg-subYellow text-black outline outline-1 outline-white outline-offset-[-1px]'
                      : 'bg-300 text-700 hover:bg-yellow-200 outline outline-1 outline-white outline-offset-[-1px]'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <CharacterSVG className="w-4 h-4" />
                    {timer.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
