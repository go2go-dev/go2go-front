import { User, ChevronRight } from 'lucide-react';
import TimerList from '@/components/timer/TimerList';
import type { Timer } from '@/constants/types';
import { useNavigate } from 'react-router-dom';
import { useInfiniteTimers } from '@/hooks/useInfiniteTimers';

export default function TimerApp() {
  const navigate = useNavigate();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteTimers();

  // 서버에서 받아온 타이머 리스트 합치기
  const timers: Timer[] = data?.pages.flatMap((page) => page.content ?? []).filter(Boolean) ?? [];

  // onScroll로 무한스크롤 구현 - 라이브러리 없이!
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    // 스크롤이 끝에 가까이 오면 (5px 여유)
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-white h-screen flex flex-col">
      {/* 헤더 */}
      <div className="flex justify-between items-center pb-5 pt-12 px-4 flex-shrink-0">
        <h1 className="text-h2 text-black">타이머</h1>
        <User className="w-6 h-6 text-gray-600" />
      </div>

      {/* 타이머 리스트 영역 - grow로 유동적으로 */}
      <div className="overflow-y-auto flex-grow" onScroll={handleScroll}>
        <div style={{ height: '480px', maxHeight: '480px' }}>
          <TimerList timers={timers} />

          {/* 무한스크롤 로더 */}
          {hasNextPage && (
            <div className="h-10 flex items-center justify-center">
              {isFetchingNextPage && <div className="text-sm text-gray-500">로딩 중...</div>}
            </div>
          )}
        </div>
      </div>

      {/* 하단 고정 영역 - 진짜 바닥에 붙음 */}
      <div className="flex-shrink-0  pb-8 pt-7 bg-white">
        {/* 타이머 추가 버튼 */}
        <div className="mb-4">
          <button
            onClick={() => navigate('/addTimer')}
            className="w-full bg-gray-700 text-white py-4 rounded-2xl font-medium text-lg"
          >
            타이머 추가
          </button>
        </div>

        {/* 먼지 치우기 영역 */}
        <div className="bg-100 p-4 flex items-center justify-between py-4 rounded-xl">
          <div className="flex-1">
            <div className="text-body2 text-black">먼지 치우기</div>
            <div className="text-body4 text-500">할 일을 적고 해치워봐요</div>
          </div>
          <ChevronRight
            className="w-5 h-5 text-black cursor-pointer"
            onClick={() => navigate('/todo')}
          />
        </div>
      </div>
    </div>
  );
}
