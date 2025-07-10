import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TodoSection from '@/components/todo/TodoSection';
import TodoHeader from '@/components/TodoHeader';
import TodoInputBar from '@/components/todo/TodoInput';
import todoChar from '@/assets/gif/todo.gif';
import { useGetTodos } from '@/hooks/useGetTodos';
import { useAddTodo } from '@/hooks/useAddTodo'; // 서버에 추가할 때 사용

export default function TodoApp() {
  const { data, isLoading, error } = useGetTodos();
  const addTodoMutation = useAddTodo();

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
        text: todo.content,
        isChecked: todo.isDone,
        isTag: !!todo.timerName,
      })),
    })) ?? [];

  const handleAddTodo = (content: string, timerId?: number) => {
    addTodoMutation.mutate({ content, timerId: timerId ?? 0 });
  };

  return (
    <div className="relative min-h-screen pb-24 bg-100">
      <TodoHeader
        title="먼지 치우기"
        onLeftClick={() => navigate('/')}
        onRightClick={() => setIsAdding(true)}
      />

      <img src={todoChar} alt="먼지치우기배경" className="w-full" />

      {isLoading && <p className="p-4 text-center text-gray-500">불러오는 중...</p>}
      {error && <p className="p-4 text-center text-red-500">에러가 발생했어요.</p>}

      {mappedData.map((section) => (
        <TodoSection
          key={section.date}
          {...section}
          onDeleteTodo={(todoIndex) => console.log('delete', section.date, todoIndex)}
        />
      ))}

      {isAdding && <TodoInputBar onClose={() => setIsAdding(false)} onSubmit={handleAddTodo} />}
    </div>
  );
}
