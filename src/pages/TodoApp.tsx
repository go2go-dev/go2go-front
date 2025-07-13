import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TodoSection from '@/components/todo/TodoSection';
import TodoHeader from '@/components/TodoHeader';
import TodoInputBar from '@/components/todo/TodoInput';
import todoChar from '@/assets/gif/todo.gif';
import { useGetTodos } from '@/hooks/useGetTodos';
import { useAddTodo } from '@/hooks/useAddTodo';
import { useGetSimpleTimers } from '@/hooks/useGetSimpleTimers';

export default function TodoApp() {
  const { data, isLoading, error } = useGetTodos();
  const addTodoMutation = useAddTodo();
  const { timers, isFetching } = useGetSimpleTimers();

  const [isAdding, setIsAdding] = useState(false);
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
        timerId: todo.timerId, // timerId 추가
      })),
    })) ?? [];

  // ✅ 타이머 선택이 선택사항이므로 undefined 허용
  const handleAddTodo = (content: string, timerId?: number) => {
    console.log('할일 추가:', { content, timerId }); // 디버깅용

    // timerId가 있을 때만 포함하여 요청
    if (timerId) {
      addTodoMutation.mutate({ content, timerId });
    } else {
      // timerId가 없으면 content만 보내기
      addTodoMutation.mutate({ content });
    }
  };

  const handleAddButtonClick = () => {
    setIsAdding(true);
  };

  return (
    <div className="relative min-h-screen pb-24 bg-100">
      <TodoHeader
        title="먼지 치우기"
        onLeftClick={() => navigate('/')}
        onRightClick={handleAddButtonClick}
      />

      <img src={todoChar} alt="먼지치우기배경" className="w-full" />

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
  );
}
