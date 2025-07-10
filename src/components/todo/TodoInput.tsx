import { useEffect, useRef, useState } from 'react';
import { useInfiniteTimers } from '@/hooks/useInfiniteTimers';

interface TodoInputBarProps {
  onClose?: () => void;
  onSubmit?: (content: string, timerId?: number) => void;
}

export default function TodoInputBar({ onClose, onSubmit }: TodoInputBarProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedTimerId, setSelectedTimerId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data, fetchNextPage, hasNextPage } = useInfiniteTimers();

  const timerTags = data?.pages.flatMap((page) => page.timerList) ?? [];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    onSubmit?.(inputValue.trim(), selectedTimerId ?? undefined);
    setInputValue('');
    setSelectedTimerId(null);
    onClose?.();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-50">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setSelectedTimerId(null); // 직접 입력 시 선택 해제
        }}
        placeholder="할 일을 적어주세요"
        className="w-full border p-2 rounded mb-2"
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit();
          if (e.key === 'Escape') onClose?.();
        }}
      />

      <div className="flex gap-2 overflow-x-auto mb-2">
        {timerTags.map((tag) => (
          <button
            key={tag.timerId}
            onClick={() => {
              setInputValue(tag.name);
              setSelectedTimerId(tag.timerId);
            }}
            className={`bg-yellow-200 text-xs px-3 py-1 rounded-full whitespace-nowrap ${
              selectedTimerId === tag.timerId ? 'ring-2 ring-yellow-500' : ''
            }`}
          >
            ⏱ {tag.name}
          </button>
        ))}
        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            className="text-xs text-blue-500 underline whitespace-nowrap"
          >
            더 보기
          </button>
        )}
      </div>

      <div className="flex justify-between">
        <button onClick={handleSubmit} className="bg-black text-white px-4 py-2 rounded text-sm">
          추가하기
        </button>
        <button onClick={onClose} className="text-sm text-gray-500 underline">
          입력 닫기
        </button>
      </div>
    </div>
  );
}
