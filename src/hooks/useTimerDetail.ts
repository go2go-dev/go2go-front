import { fetchWithAuth } from '@/api/fetchWithAuth';
import { useQuery } from '@tanstack/react-query';

interface TodoItem {
  todoId: number;
  content: string;
  isDone: boolean;
}

interface TimerDetailResponse {
  code: null;
  message: string;
  result: {
    timerId: number;
    name: string;
    minutes: number;
    todoList: TodoItem[];
  };
}

export function useTimerDetail(timerId?: number) {
  const ACCESS_TOKEN = localStorage.getItem('accessToken');

  return useQuery<TimerDetailResponse>({
    queryKey: ['timerDetail', timerId],
    queryFn: async (): Promise<TimerDetailResponse> => {
      if (!timerId) {
        throw new Error('timerId가 필요합니다.');
      }

      const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/api/timers/${timerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      });

      if (!res.ok) {
        throw new Error(`타이머 상세 조회 실패: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      return data;
    },
    enabled: !!timerId && !!ACCESS_TOKEN, // timerId와 토큰이 모두 있을 때만 실행

    // 캐싱 및 refetch 최적화
    staleTime: 5 * 60 * 1000, // 5분간 데이터를 fresh로 간주
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지 (구 cacheTime)

    // 불필요한 refetch 방지
    refetchOnWindowFocus: false,
    refetchOnMount: 'always', // 마운트 시에는 항상 최신 데이터 가져오기
    refetchOnReconnect: true, // 네트워크 재연결 시 refetch

    // 재시도 설정
    retry: (failureCount, error) => {
      // 인증 에러(401)나 권한 에러(403)는 재시도하지 않음
      if (error instanceof Error && error.message.includes('401')) return false;
      if (error instanceof Error && error.message.includes('403')) return false;
      // 최대 2번까지 재시도
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 지수 백오프
  });
}
