import { useQuery } from '@tanstack/react-query';

export function useTimerDetail(timerId?: number) {
  const ACCESS_TOKEN = localStorage.getItem('accessToken');
  return useQuery({
    queryKey: ['timerDetail', timerId],
    queryFn: async () => {
      if (!timerId) throw new Error('timerId 없음');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/timers/${timerId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      });
      if (!res.ok) throw new Error('타이머 상세 조회 실패');
      return res.json();
    },
    enabled: !!timerId,
  });
}
