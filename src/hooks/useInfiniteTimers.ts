import { fetchWithAuth } from '@/api/fetchWithAuth';
import { useInfiniteQuery } from '@tanstack/react-query';


const fetchTimers = async ({ pageParam = 1 }) => {
    const ACCESS_TOKEN = localStorage.getItem('accessToken');
  const res = await fetchWithAuth(
    `${import.meta.env.VITE_API_URL}/api/timers?page=${pageParam}&size=6`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    },
  );
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
