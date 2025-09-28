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

  // ✅ 효율적인 포커스 로직
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const focusInput = () => {
      if (!inputRef.current) return false;

      try {
        inputRef.current.focus();

        // 모바일에서만 추가 작업
        if (isMobile) {
          inputRef.current.click();
        }

        // 포커스 성공 확인
        return document.activeElement === inputRef.current;
      } catch (error) {
        console.warn('Focus failed:', error);
        return false;
      }
    };

    // 단일 재시도 로직
    let retryCount = 0;
    const maxRetries = 3;

    const tryFocus = () => {
      const success = focusInput();

      if (!success && retryCount < maxRetries) {
        retryCount++;
        setTimeout(tryFocus, 100 * retryCount); // 100ms, 200ms, 300ms
      }
    };

    // 즉시 시도
    tryFocus();

    // 정리 함수는 필요 없음 (타이머 하나만 사용)
  }, []);

  // ✅ 간단한 애니메이션 완료 후 포커스
  const handleAnimationComplete = () => {
    // 애니메이션 완료 후 한 번만 포커스 시도
    if (inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.focus();
    }
  };

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

  // ✅ 간단한 타이머 선택 핸들러
  const handleTimerSelect = (timerId: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    setSelectedTimerId(timerId);

    // 간단한 포커스 복원
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
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
        onAnimationComplete={handleAnimationComplete}
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
              enterKeyHint="done"
              inputMode="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit();
                }
                if (e.key === 'Escape') {
                  onClose?.();
                }
              }}
              onBlur={(e) => {
                const relatedTarget = e.relatedTarget as HTMLElement;
                if (!relatedTarget || containerRef.current?.contains(relatedTarget)) {
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
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                  onClick={(e) => handleTimerSelect(timer.timerId, e)}
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
