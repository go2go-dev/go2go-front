// TodoSection.tsx 수정된 부분
import TodoItem from './TodoItem';

interface TodoSectionProps {
  date: string;
  todos: {
    todoId: number; // ✅ 추가
    text: string;
    isChecked?: boolean;
    isTag?: boolean;
    timerName?: string; // ✅ 추가
  }[];
  onDeleteTodo?: (index: number) => void;
}

export default function TodoSection({ date, todos, onDeleteTodo }: TodoSectionProps) {
  return (
    <section className="mt-4">
      <h2 className="text-xs text-gray-400 mb-2">{date}</h2>
      <div className="flex flex-col gap-2">
        {todos.map((todo, idx) => (
          <TodoItem
            key={todo.todoId} // ✅ key를 todoId로 변경 (더 안정적)
            todoId={todo.todoId} // ✅ todoId 전달
            text={todo.text}
            isChecked={todo.isChecked}
            isTag={todo.isTag}
            timerName={todo.timerName} // ✅ timerName 전달
            onDelete={() => onDeleteTodo?.(idx)}
          />
        ))}
      </div>
    </section>
  );
}
