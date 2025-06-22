'use client';

import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AddTimer() {
  const [timerName, setTimerName] = useState<string>('');
  const [selectedMinutes, setSelectedMinutes] = useState<number>(25);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef<boolean>(false);
  const navigate = useNavigate();

  // 5 ~ 180분까지 5분 단위로 옵션 생성
  const timeOptions: number[] = [];
  for (let i = 5; i <= 180; i += 5) {
    timeOptions.push(i);
  }

  const ITEM_HEIGHT = 48;
  const CONTAINER_HEIGHT = 240;
  const PADDING = 96;

  const getScrollPositionForIndex = (index: number): number => {
    return index * ITEM_HEIGHT;
  };

  const getClosestIndex = (scrollTop: number): number => {
    const index = Math.round(scrollTop / ITEM_HEIGHT);
    return Math.max(0, Math.min(index, timeOptions.length - 1));
  };

  const snapToClosestItem = () => {
    if (!scrollRef.current) return;

    const scrollTop = scrollRef.current.scrollTop;
    const closestIndex = getClosestIndex(scrollTop);
    const targetScrollTop = getScrollPositionForIndex(closestIndex);

    scrollRef.current.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth',
    });

    setSelectedMinutes(timeOptions[closestIndex]);
  };

  useEffect(() => {
    const defaultIndex = timeOptions.indexOf(25);
    if (scrollRef.current && defaultIndex !== -1) {
      const targetScrollTop = getScrollPositionForIndex(defaultIndex);
      scrollRef.current.scrollTop = targetScrollTop;
    }

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;

    isScrollingRef.current = true;
    const scrollTop = scrollRef.current.scrollTop;
    const closestIndex = getClosestIndex(scrollTop);

    if (closestIndex >= 0 && closestIndex < timeOptions.length) {
      setSelectedMinutes(timeOptions[closestIndex]);
    }

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
      snapToClosestItem();
    }, 150);
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}분`;
    }
    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;
    return remaining === 0 ? `${hours}시간` : `${hours}시간 ${remaining}분`;
  };

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen flex flex-col">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between  pt-10">
        <X className="w-6 h-6 text-gray-600" onClick={() => navigate('/')} />
        <div></div>
      </div>

      {/* 타이머 이름 입력 */}
      <div className=" mb-8">
        <label className="block text-gray-600 text-sm mb-2">타이머 이름 *</label>
        <input
          type="text"
          value={timerName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTimerName(e.target.value)}
          placeholder="타이머 이름"
          className="w-full px-0 py-3 text-lg border-0 border-b-2 border-gray-200 focus:border-blue-500 focus:outline-none bg-transparent"
        />
      </div>

      {/* 타이머 시간 선택 */}
      <div className="mb-8">
        <label className="block text-gray-600 text-sm mb-4">타이머 시간 *</label>

        <div className="relative">
          <div className="absolute bg-100 left-0 right-0 top-1/2 transform -translate-y-1/2 h-12 rounded-lg  pointer-events-none z-0"></div>

          <div
            ref={scrollRef}
            className="h-60 overflow-y-scroll scrollbar-hide relative"
            onScroll={handleScroll}
            style={{
              scrollBehavior: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <div className="h-24" />

            {timeOptions.map((minutes, index) => {
              const isSelected = selectedMinutes === minutes;
              const scale = isSelected ? 'scale-110' : 'scale-100'; // scale 효과만 내부 요소에 적용
              const opacity = isSelected ? 'opacity-100' : 'opacity-50';
              const fontWeight = isSelected ? 'font-bold' : 'font-medium';

              return (
                <div
                  key={minutes}
                  className={`h-12 flex items-center justify-center text-lg transition-all duration-300 ease-out transform ${opacity} ${fontWeight} cursor-pointer`}
                  onClick={() => {
                    const targetScrollTop = getScrollPositionForIndex(index);
                    if (scrollRef.current) {
                      scrollRef.current.scrollTo({
                        top: targetScrollTop,
                        behavior: 'smooth',
                      });
                    }
                    setSelectedMinutes(minutes);
                  }}
                  style={{
                    color: isSelected ? '#1f2937' : '#9ca3af',
                  }}
                >
                  <div className={`transform ${scale}`}>
                    {/* scale을 내부 div에만 적용 */}
                    {formatTime(minutes)}
                  </div>
                </div>
              );
            })}

            <div className="h-24" />
          </div>
        </div>

        {/* 선택된 시간 표시 */}
        <div className="mt-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{formatTime(selectedMinutes)}</div>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="mt-auto mb-8">
        <button
          className={`w-full py-4 rounded-2xl font-medium text-lg transition-colors ${
            timerName.trim()
              ? 'bg-yellow-300 text-gray-800 hover:bg-yellow-400'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          disabled={!timerName.trim()}
        >
          저장
        </button>
      </div>
    </div>
  );
}
