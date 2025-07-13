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
    <div className="max-w-sm mx-auto bg-white h-screen">
      {/* 헤더 */}
      <div className="flex justify-between items-center pb-5 pt-4">
        <h1 className="text-h2 text-black">타이머</h1>
        <User onClick={() => navigate('/setting')}
          className="w-6 h-6 text-gray-600" />
      </div>

      {/* 타이머 리스트 영역 - 스크롤 가능한 고정 높이 */}
      <div
        className="overflow-y-auto "
        style={{ height: 'calc(100vh - 320px)' }}
        onScroll={handleScroll}
      >
        <TimerList timers={timers} />

        {/* 무한스크롤 로더 */}
        {hasNextPage && (
          <div className="h-10 flex items-center justify-center">
            {isFetchingNextPage && <div className="text-sm text-gray-500">로딩 중...</div>}
          </div>
        )}
      </div>

      {/* 하단 고정 영역 */}
      <div className="pb-8 pt-7 bg-white 4">
        {/* 타이머 추가 버튼 */}
        <div className="mb-6 flex justify-center">
          <button
            onClick={() => navigate('/addTimer')}
            className="px-[34px] py-3 bg-[#35384A] rounded-full inline-flex justify-center items-center gap-[10px] border-none cursor-pointer"
          >
            <div className="text-center text-white text-[15px] font-semibold">타이머 추가</div>
          </button>
        </div>
        {/* 먼지 치우기 영역 */}
        <div className="bg-100 p-4 flex items-center justify-between py-4 rounded-xl">
          <div className="flex-1">
            <div className="flex items-center">
              <div className="text-body2 text-black">먼지 치우기</div>
              <div className="text-body4 text-500 pl-3">할 일을 적고 해치워봐요</div>
            </div>
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
