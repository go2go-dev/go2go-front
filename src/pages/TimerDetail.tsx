import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import TodoItem from '@/components/todo/TodoItem';

type Todo = {
  todoId: number;
  isDone: boolean;
  content: string;
};

type TimerData = {
  name: string;
  minutes: number;
  todoList: Todo[];
};

const MOCK_DATA: TimerData = {
  name: '정처기 공부',
  minutes: 130,
  todoList: [
    { todoId: 1, isDone: true, content: '1장 공부하기' },
    { todoId: 2, isDone: false, content: '2장 공부하기' },
    { todoId: 3, isDone: false, content: '3장 복습하기' },
    { todoId: 4, isDone: false, content: '4장 요약 정리' },
    { todoId: 5, isDone: false, content: '기출문제 풀기' },
  ],
};

export default function TimerDetail() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [todoList, setTodoList] = useState<Todo[]>(MOCK_DATA.todoList);
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleAddTodo = () => {
    if (!inputValue.trim()) return;
    const newTodo: Todo = {
      todoId: Date.now(),
      content: inputValue.trim(),
      isDone: false,
    };
    setTodoList((prev) => [...prev, newTodo]);
    setInputValue('');
    setIsAdding(false);
  };

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m.toString().padStart(2, '0')}:00`;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between px-4 pt-16 pb-6 relative">
      {/* 헤더 */}
      <div className="absolute top-4 left-4 text-sm text-gray-800 cursor-pointer">&larr;</div>
      <h1 className="text-lg font-semibold">{MOCK_DATA.name}</h1>

      {/* 이미지 */}
      <div className="mt-10">
        <img src="/default.png" alt="Timer image" className="w-24 h-24 mx-auto" />
      </div>

      {/* 타이머 시간 */}
      <div className="text-4xl font-bold text-gray-800 mt-8">{formatTime(MOCK_DATA.minutes)}</div>

      {/* 종료하기 버튼 */}
      <button className="mt-6 px-6 py-3 rounded-full bg-gray-100 text-gray-800 text-sm font-medium">
        종료하기
      </button>

      {/* 바텀시트 트리거 */}
      <button
        onClick={() => setIsSheetOpen(true)}
        className="mt-auto text-sm bg-gray-800 text-white px-4 py-2 rounded-full relative"
      >
        오늘 해야 할 일을 적어보세요!!
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-3 h-3 bg-gray-800 rotate-45"></div>
      </button>

      {/* 바텀시트 */}
      <AnimatePresence>
        {isSheetOpen && (
          <>
            {/* 오버레이 */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-30 z-40"
              onClick={() => setIsSheetOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* 시트 */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[60vh] flex flex-col"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              {/* 고정된 헤더 영역 */}
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold">오늘의 할 일</h2>
                <button onClick={() => setIsAdding(true)}>
                  <Plus className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* 스크롤 가능한 내용 영역 */}
              <div className="overflow-y-auto px-6 pt-4 pb-6 flex-1">
                {/* 입력창 */}
                <AnimatePresence>
                  {isAdding && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-start gap-2 p-3 rounded-lg bg-gray-100 mb-3"
                    >
                      <div className="w-5 h-5 min-w-5 min-h-5 bg-gray-200 rounded-md" />
                      <input
                        ref={inputRef}
                        type="text"
                        className="text-[16px] flex-1 bg-transparent outline-none text-gray-800"
                        placeholder="할 일을 적어주세요"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddTodo();
                          if (e.key === 'Escape') setIsAdding(false);
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 할일 목록 */}
                <div className="space-y-3">
                  {todoList.map((todo) => (
                    <TodoItem key={todo.todoId} text={todo.content} isChecked={todo.isDone} />
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
