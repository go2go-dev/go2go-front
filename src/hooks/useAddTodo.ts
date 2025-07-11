import { fetchWithAuth } from '@/api/fetchWithAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type AddTodoRequest = {
  timerId?: number;
  content: string;
};

type AddTodoResponse = {
  result: string;
  todoId: number;
};

const addTodo = async (data: AddTodoRequest): Promise<AddTodoResponse> => {
  const ACCESS_TOKEN = localStorage.getItem('accessToken');
  const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/api/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      content: data.content,
      ...(data.timerId !== undefined && { timerId: data.timerId }),
    }),
  });

  if (!res.ok) throw new Error('할일 추가 실패');
  return res.json();
};

export function useAddTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTodo,
    onSuccess: (data, variables) => {
      if (variables?.timerId !== undefined) {
        queryClient.invalidateQueries({ queryKey: ['todos'] });
        queryClient.invalidateQueries({ queryKey: ['timerDetail'] });
      }

      console.log('할일 추가 성공:', data);
    },
    onError: (error) => {
      console.error('할일 추가 실패:', error);
      alert('할일 추가에 실패했습니다.');
    },
  });
}
