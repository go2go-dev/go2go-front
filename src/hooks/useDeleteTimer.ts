// hooks/useDeleteTimer.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

const ACCESS_TOKEN =
  'eyJKV1QiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJ0eXBlIjoiQUNDRVNTIiwiaWQiOjEsInJvbGUiOiJVU0VSIiwic3ViIjoiMSIsImlhdCI6MTc1MDg1NTg0NiwiZXhwIjoxNzUxNDYwNjQ2fQ.99G5hkd2buzfu8aWXYVxoOyc016f0I46W5mH8aJIr5uzzb6rdd1tJtHY2qOy_Xfn';

const deleteTimer = async (timerId: number): Promise<void> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/timers/${timerId}`, {
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
