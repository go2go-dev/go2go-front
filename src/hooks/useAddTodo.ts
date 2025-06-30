import { useMutation, useQueryClient } from '@tanstack/react-query';

const ACCESS_TOKEN =
  'eyJKV1QiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJ0eXBlIjoiQUNDRVNTIiwiaWQiOjEsInJvbGUiOiJVU0VSIiwic3ViIjoiMSIsImlhdCI6MTc1MDg1NTg0NiwiZXhwIjoxNzUxNDYwNjQ2fQ.99G5hkd2buzfu8aWXYVxoOyc016f0I46W5mH8aJIr5uzzb6rdd1tJtHY2qOy_Xfn';

type AddTodoRequest = {
  timerId: number;
  content: string;
};

type AddTodoResponse = {
  result: string;
  todoId: number;
};

const addTodo = async (data: AddTodoRequest): Promise<AddTodoResponse> => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('할일 추가 실패');
  return res.json();
};

export function useAddTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTodo,
    onSuccess: (data, variables) => {
      // 성공 시 해당 타이머의 상세 정보 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['timerDetail', variables.timerId],
      });

      console.log('할일 추가 성공:', data);
    },
    onError: (error) => {
      console.error('할일 추가 실패:', error);
      alert('할일 추가에 실패했습니다.');
    },
  });
}
