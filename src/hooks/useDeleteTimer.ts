// hooks/useDeleteTimer.ts
import { fetchWithAuth } from '@/api/fetchWithAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const deleteTimer = async (timerId: number): Promise<void> => {
  const ACCESS_TOKEN = localStorage.getItem('accessToken');
  const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/api/timers/${timerId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error('타이머 삭제에 실패했습니다.');
  }
};

export const useDeleteTimer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTimer,
    onSuccess: () => {
      // 타이머 목록 캐시 무효화로 UI 업데이트
      queryClient.invalidateQueries({ queryKey: ['timers'] });
    },
    onError: (error) => {
      console.error('타이머 삭제 실패:', error);
    },
  });
};
