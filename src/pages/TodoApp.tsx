import { useState, useRef, useEffect } from 'react';
import TodoSection from '@/components/todo/TodoSection';
import TodoItem from '@/components/todo/TodoItem';
import { Plus, ChevronLeft } from 'lucide-react';

export default function TodoApp() {
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const [todoData, setTodoData] = useState([
    {
      date: '2025. 06. 14',
      todos: [
        { text: '자격증 공부하기', isTag: true },
        { text: '자격증 공부하기', isChecked: true, isTag: true },
        {
          text: '할 일이 두 줄 넘어가는 경우\n할 일이 두 줄 넘어가는 경우\n할 일이 두 줄 넘어가는 경우',
        },
      ],
    },
    {
      date: '2025. 06. 13',
      todos: [
        { text: '와이어프레임 완성하기' },
        { text: '자격증 공부하기', isTag: true },
        { text: '자격증 공부하기', isTag: true, isChecked: true },
        { text: '자격증 공부하기', isChecked: true },
      ],
    },
  ]);

  // + 버튼 눌렀을 때 입력 상태로 변경
  const startAdding = () => {
    setIsAdding(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  // 할 일 추가
  const handleAddTodo = () => {
    if (!inputValue.trim()) return;

    setTodoData((prev) => {
      const newTodo = { text: inputValue.trim(), isChecked: false }; // isChecked를 명시적으로 false로
      const updated = [...prev];
      updated[0].todos.unshift(newTodo); // 최신 날짜의 맨 위에 추가
      return updated;
    });

    setInputValue('');
    setIsAdding(false);
  };

  return (
    <div className="relative min-h-screen pb-24 bg-white">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <button>
          <ChevronLeft />
        </button>
        <h1 className="text-sm font-semibold">먼지 치우기</h1>
        <button onClick={startAdding}>
          <Plus />
        </button>
      </div>

      {/* Todo Sections */}
      <div className="px-4">
        {/* 상단에 입력 중인 아이템 */}
        {isAdding && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-gray-100">
            <div className="w-5 h-5 min-w-5 min-h-5 bg-gray-200 rounded-md" />
            <input
              ref={inputRef}
              type="text"
              className="text-sm flex-1 bg-transparent outline-none"
              placeholder="할 일을 적어주세요"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddTodo();
                if (e.key === 'Escape') setIsAdding(false);
              }}
            />
          </div>
        )}

        {todoData.map((section, idx) => (
          <TodoSection key={idx} {...section} />
        ))}
      </div>
    </div>
  );
}
