import { useQuery } from '@tanstack/react-query';

const ACCESS_TOKEN =
  'eyJKV1QiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJ0eXBlIjoiQUNDRVNTIiwiaWQiOjEsInJvbGUiOiJVU0VSIiwic3ViIjoiMSIsImlhdCI6MTc1MDg1NTg0NiwiZXhwIjoxNzUxNDYwNjQ2fQ.99G5hkd2buzfu8aWXYVxoOyc016f0I46W5mH8aJIr5uzzb6rdd1tJtHY2qOy_Xfn';

export function useTimerDetail(timerId?: number) {
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
