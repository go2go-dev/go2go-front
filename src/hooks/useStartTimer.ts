import { useMutation } from '@tanstack/react-query';

const ACCESS_TOKEN =
  'eyJKV1QiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJ0eXBlIjoiQUNDRVNTIiwiaWQiOjEsInJvbGUiOiJVU0VSIiwic3ViIjoiMSIsImlhdCI6MTc1MDg1NTg0NiwiZXhwIjoxNzUxNDYwNjQ2fQ.99G5hkd2buzfu8aWXYVxoOyc016f0I46W5mH8aJIr5uzzb6rdd1tJtHY2qOy_Xfn';

export function useStartTimer() {
  return useMutation({
    mutationFn: async (timerId: number) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/timers/${timerId}/start`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      });
      if (!res.ok) throw new Error('타이머 시작 실패');
      return res.json();
    },
  });
}
