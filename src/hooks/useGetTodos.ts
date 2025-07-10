import { useQuery } from '@tanstack/react-query';

export interface TodoItem {
  todoId: number;
  isDone: boolean;
  content: string;
  timerId: number;
  timerName: string;
}

export interface TodoSectionResponse {
  createdAt: string; // e.g. "2025-07-09"
  todos: TodoItem[];
}

const getTodos = async (): Promise<TodoSectionResponse[]> => {
  const ACCESS_TOKEN = localStorage.getItem('accessToken');

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/todos`, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });

  if (!res.ok) throw new Error('할일 목록 불러오기 실패');

  const json = await res.json();
  return json.result; // ✅ 여기!
};

export function useGetTodos() {
  return useQuery<TodoSectionResponse[], Error>({
    queryKey: ['todos'],
    queryFn: getTodos,
  });
}
