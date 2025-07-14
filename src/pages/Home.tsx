import { ChevronRight } from 'lucide-react';
import TimerList from '@/components/timer/TimerList';
import type { Timer } from '@/constants/types';
import { useNavigate } from 'react-router-dom';
import { useInfiniteTimers } from '@/hooks/useInfiniteTimers';
import LogoIcon from '@/assets/svg/Group.svg?react';
import ProfileIcon from '@/assets/svg/person.svg?react';

export default function TimerApp() {
  const navigate = useNavigate();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteTimers();

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

  // 빈 상태 컴포넌트
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <div className="text-center mb-8">
        <p className="text-gray-500 text-base mb-2">지금 바로 타이머를</p>
        <p className="text-gray-500 text-base">설정해보세요!</p>
      </div>
      <button
        onClick={() => navigate('/addTimer')}
        className="px-[34px] py-3 bg-[#35384A] rounded-full inline-flex justify-center items-center gap-[10px] border-none cursor-pointer"
      >
        <div className="text-center text-white text-[15px] font-semibold">타이머 추가</div>
      </button>
    </div>
  );

  return (
    <div className="flex-1">
      {/* 헤더 */}
      <div className="flex justify-between items-center pt-8 pb-8">
        <LogoIcon className="h-5 left-0" />
        <ProfileIcon onClick={() => navigate('/setting')} className="w-6 h-6 text-gray-600" />
      </div>

      {/* 타이머 리스트 영역 - 스크롤 가능한 고정 높이 */}
      <div
        className="overflow-y-auto"
        style={{ height: 'calc(100vh - 250px)' }}
        onScroll={handleScroll}
      >
        {/* 로딩 상태 */}
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-sm text-gray-500">타이머를 불러오는 중...</div>
          </div>
        ) : timers.length === 0 ? (
          /* 빈 상태 */
          <EmptyState />
        ) : (
          /* 타이머 리스트 */
          <>
            <TimerList timers={timers} />
            {/* 무한스크롤 로더 */}
            {hasNextPage && (
              <div className="h-10 flex items-center justify-center">
                {isFetchingNextPage && <div className="text-sm text-gray-500">로딩 중...</div>}
              </div>
            )}
          </>
        )}
      </div>

      {/* 하단 고정 영역 - 타이머가 있을 때만 표시 */}
      {timers.length > 0 && (
        <div className="bg-white">
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
      )}
    </div>
  );
}
