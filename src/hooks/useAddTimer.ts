import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useAddTimer() {
  const queryClient = useQueryClient();
  const ACCESS_TOKEN = localStorage.getItem('accessToken');
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
