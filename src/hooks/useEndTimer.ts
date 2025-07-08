import { useMutation } from '@tanstack/react-query';

export function useEndTimer() {
  const ACCESS_TOKEN = localStorage.getItem('accessToken');
  return useMutation({
    mutationFn: async (timerId: number) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/timers/${timerId}/end`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      });
      if (!res.ok) throw new Error('타이머 종료 실패');
      return res.json();
    },
  });
}
