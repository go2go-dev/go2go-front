// hooks/useDeleteTodo.ts
import { fetchWithAuth } from '@/api/fetchWithAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const deleteTodo = async (todoId: number): Promise<void> => {
  const ACCESS_TOKEN = localStorage.getItem('accessToken');
  const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/api/todos/${todoId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error('할일 삭제에 실패했습니다.');
  }
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      // 할일 목록 캐시 무효화로 UI 업데이트
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      // 타이머 관련 캐시도 무효화 (타이머에 연결된 할일이 있을 수 있으므로)
      queryClient.invalidateQueries({ queryKey: ['timers'] });
    },
    onError: (error) => {
      console.error('할일 삭제 실패:', error);
    },
  });
};
