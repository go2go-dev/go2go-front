import TodoItem from './TodoItem';

interface TodoSectionProps {
  date: string;
  todos: {
    text: string;
    isChecked?: boolean;
    isTag?: boolean;
  }[];
  onDeleteTodo?: (index: number) => void;
}

export default function TodoSection({ date, todos, onDeleteTodo }: TodoSectionProps) {
  return (
    <section className="mt-4">
      <h2 className="text-xs text-gray-400 mb-2">{date}</h2>
      <div className="flex flex-col gap-2">
        {todos.map((todo, idx) => (
          <TodoItem key={idx} {...todo} onDelete={() => onDeleteTodo?.(idx)} />
        ))}
      </div>
    </section>
  );
}
