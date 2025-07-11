import { fetchWithAuth } from '@/api/fetchWithAuth';
import { useQuery } from '@tanstack/react-query';

const fetchSimpleTimers = async () => {
  const ACCESS_TOKEN = localStorage.getItem('accessToken');
  const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/api/timers/simple`, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });
  if (!res.ok) throw new Error('타이머 목록 불러오기 실패');
  return res.json();
};

export function useGetSimpleTimers() {
  const { data, isFetching } = useQuery({
    queryKey: ['simpleTimers'],
    queryFn: fetchSimpleTimers,
  });

  return {
    timers: data?.result ?? [],
    isFetching,
  };
}
