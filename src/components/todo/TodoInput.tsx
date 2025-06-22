import { useState, useRef, useEffect } from 'react';

interface TodoInputBarProps {
  onClose?: () => void;
}

export default function TodoInputBar({ onClose }: TodoInputBarProps) {
  const [showInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // + 버튼 눌렀을 때 input에 focus
  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-50">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="할 일을 적어주세요"
        className="w-full border p-2 rounded mb-2"
      />

      {/* 태그 버튼 */}
      <div className="flex gap-2 overflow-x-auto">
        <button className="bg-yellow-200 text-xs px-3 py-1 rounded-full whitespace-nowrap">
          ⏱ 코딩 공부하기
        </button>
        <button className="bg-yellow-200 text-xs px-3 py-1 rounded-full whitespace-nowrap">
          ⏱ 운동하기
        </button>
      </div>

      {/* 닫기 버튼 */}
      <button onClick={onClose} className="mt-3 text-sm text-gray-500 underline">
        입력 닫기
      </button>
    </div>
  );
}
