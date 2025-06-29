import { useInfiniteQuery } from '@tanstack/react-query';

const ACCESS_TOKEN =
  'eyJKV1QiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJ0eXBlIjoiQUNDRVNTIiwiaWQiOjEsInJvbGUiOiJVU0VSIiwic3ViIjoiMSIsImlhdCI6MTc1MDg1NTg0NiwiZXhwIjoxNzUxNDYwNjQ2fQ.99G5hkd2buzfu8aWXYVxoOyc016f0I46W5mH8aJIr5uzzb6rdd1tJtHY2qOy_Xfn';

const fetchTimers = async ({ pageParam = 1 }) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/timers?page=${pageParam}&size=6`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });
  if (!res.ok) throw new Error('네트워크 오류');
  const data = await res.json();
  return data.result;
};

export function useInfiniteTimers() {
  return useInfiniteQuery({
    queryKey: ['timers'],
    queryFn: fetchTimers,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasNext) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}
