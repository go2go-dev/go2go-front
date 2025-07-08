import { useState, useRef } from 'react';
import TodoSection from '@/components/todo/TodoSection';
import TodoHeader from '@/components/TodoHeader';
import { useNavigate } from 'react-router-dom';
import todoChar from '@/assets/gif/todo.gif';

const timerTags = [{ name: '코딩 공부하기' }, { name: '디자인 스터디하기' }, { name: '운동하기' }];

export default function TodoApp() {
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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

  const handleDeleteTodo = (sectionDate: string, todoIndex: number) => {
    setTodoData((prevData) =>
      prevData.map((section) => {
        if (section.date === sectionDate) {
          const updatedTodos = section.todos.filter((_, index) => index !== todoIndex);
          return { ...section, todos: updatedTodos };
        }
        return section;
      }),
    );
  };

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
    <div className="relative min-h-screen pb-24 bg-100">
      {/* Header */}
      <TodoHeader
        title="먼지 치우기"
        onLeftClick={() => navigate('/')}
        onRightClick={startAdding}
      />

      <img src={todoChar} alt="먼지치우기배경" className="w-full" />
      {/* Todo Sections */}

      {/* 상단에 입력 중인 아이템 */}
      {isAdding && (
        <>
          {/* 입력창 */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-white">
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

          {/* 타이머 태그 버튼들 */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-50 safe-area-inset-bottom">
            <div className="flex gap-2 flex-wrap justify-center">
              {timerTags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInputValue((prev) => prev + tag.name);
                  }}
                  className="flex items-center bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-2 rounded-full border border-yellow-200 hover:bg-yellow-200 transition-colors"
                >
                  ⏱ {tag.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {todoData.map((section) => (
        <TodoSection
          key={section.date}
          {...section}
          onDeleteTodo={(todoIndex) => handleDeleteTodo(section.date, todoIndex)}
        />
      ))}
    </div>
  );
}
