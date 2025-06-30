import { useMutation, useQueryClient } from '@tanstack/react-query';

const ACCESS_TOKEN =
  'eyJKV1QiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJ0eXBlIjoiQUNDRVNTIiwiaWQiOjEsInJvbGUiOiJVU0VSIiwic3ViIjoiMSIsImlhdCI6MTc1MDg1NTg0NiwiZXhwIjoxNzUxNDYwNjQ2fQ.99G5hkd2buzfu8aWXYVxoOyc016f0I46W5mH8aJIr5uzzb6rdd1tJtHY2qOy_Xfn';

export function useAddTimer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, minutes }: { name: string; minutes: number }) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/timers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        body: JSON.stringify({ name, minutes }),
      });
      if (!res.ok) throw new Error('타이머 추가 실패');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timers'] });
    },
  });
}
