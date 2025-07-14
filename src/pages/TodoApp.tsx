import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TodoSection from '@/components/todo/TodoSection';
import TodoHeader from '@/components/TodoHeader';
import TodoInputBar from '@/components/todo/TodoInput';
import todoChar from '@/assets/gif/mun.gif';
import { useGetTodos } from '@/hooks/useGetTodos';
import { useAddTodo } from '@/hooks/useAddTodo';
import { useGetSimpleTimers } from '@/hooks/useGetSimpleTimers';

export default function TodoApp() {
  const { data, isLoading, error } = useGetTodos();
  const addTodoMutation = useAddTodo();
  const { timers, isFetching } = useGetSimpleTimers();

  const [isAdding, setIsAdding] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const mappedData =
    data?.map((section) => ({
      date: new Date(section.createdAt)
        .toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        .replace(/\. /g, '. ')
        .replace('.', '.'),
      todos: section.todos.map((todo) => ({
        todoId: todo.todoId,
        text: todo.content,
        isChecked: todo.isDone,
        isTag: !!todo.timerName,
        timerName: todo.timerName,
        timerId: todo.timerId,
      })),
    })) ?? [];

  const handleAddTodo = (content: string, timerId?: number) => {
    console.log('할일 추가:', { content, timerId });
    if (timerId) {
      addTodoMutation.mutate({ content, timerId });
    } else {
      addTodoMutation.mutate({ content });
    }
  };

  const handleAddButtonClick = () => {
    setIsAdding(true);
  };

  return (
    <div className="relative min-h-screen bg-100 w-full max-w-md mx-auto">
      {/* 고정 헤더 */}
      <div className="sticky top-0 bg-100 z-10">
        <TodoHeader
          title="먼지 치우기"
          onLeftClick={() => navigate('/')}
          onRightClick={handleAddButtonClick}
        />
      </div>

      {/* 스크롤 가능한 콘텐츠 영역 */}
      <div
        className="overflow-y-auto pb-24 scrollbar-hide"
        style={{ height: 'calc(100vh - 80px)' }}
      >
        {/* ✅ Layout Shift 방지를 위한 이미지 컨테이너 */}
        <div
          className="w-full relative"
          style={{
            aspectRatio: '720/200', // GIF의 실제 비율로 조정 (예시)
          }}
        >
          {/* 스켈레톤 로더 */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
          )}

          {/* 실제 GIF 이미지 */}
          <img
            src={todoChar}
            alt="먼지치우기배경"
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            loading="eager" // 우선 로드
          />
        </div>

        {isAdding && (
          <>
            {isFetching ? (
              <p className="p-4 text-center text-gray-500">타이머 불러오는 중...</p>
            ) : Array.isArray(timers) ? (
              <TodoInputBar
                onClose={() => setIsAdding(false)}
                onSubmit={handleAddTodo}
                timers={timers}
              />
            ) : (
              <p className="p-4 text-center text-red-500">타이머 데이터가 유효하지 않아요.</p>
            )}
          </>
        )}

        {isLoading && <p className="p-4 text-center text-gray-500">불러오는 중...</p>}
        {error && <p className="p-4 text-center text-red-500">에러가 발생했어요.</p>}

        {mappedData.map((section) => (
          <TodoSection
            key={section.date}
            {...section}
            onDeleteTodo={(todoIndex) => console.log('delete', section.date, todoIndex)}
          />
        ))}
      </div>
    </div>
  );
}
