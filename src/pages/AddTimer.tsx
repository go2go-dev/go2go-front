import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAddTimer } from '@/hooks/useAddTimer';

export default function AddTimer() {
  const [timerName, setTimerName] = useState<string>('');
  const [selectedMinutes, setSelectedMinutes] = useState<number>(25);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef<boolean>(false);
  const navigate = useNavigate();
  const { mutate: addTimer, isPending } = useAddTimer();

  const [keyboardOffset, setKeyboardOffset] = useState(0); // 👈 키보드 감지용

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  // 키보드 대응
  useEffect(() => {
    const handleViewportResize = () => {
      const vh = window.visualViewport?.height || window.innerHeight;
      const totalHeight = window.innerHeight;
      const keyboardHeight = totalHeight - vh;

      if (keyboardHeight > 100) {
        setKeyboardOffset(keyboardHeight);
      } else {
        setKeyboardOffset(0);
      }
    };

    window.visualViewport?.addEventListener('resize', handleViewportResize);
    return () => {
      window.visualViewport?.removeEventListener('resize', handleViewportResize);
    };
  }, []);

  // 5 ~ 180분까지 5분 단위로 옵션 생성
  const timeOptions: number[] = [];
  for (let i = 5; i <= 180; i += 5) {
    timeOptions.push(i);
  }

  const ITEM_HEIGHT = 48;

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

  const handleSave = () => {
    if (!timerName.trim()) return;
    addTimer(
      { name: timerName, minutes: selectedMinutes },
      {
        onSuccess: () => {
          navigate('/');
        },
        onError: () => {
          alert('타이머 추가 실패');
        },
      },
    );
  };

  useEffect(() => {
    if (remainingSeconds <= 0) return;
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [remainingSeconds]);

  return (
    <div className="flex-1 pb-24 bg-white h-screen flex flex-col">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between pt-8 pb-8">
        <X className="w-6 h-6 text-gray-600 cursor-pointer" onClick={() => navigate('/')} />
        <div></div>
      </div>

      {/* 타이머 이름 입력 */}
      <div className="mb-8">
        <label className="block text-gray-600 text-sm mb-2">타이머 이름 *</label>
        <input
          type="text"
          ref={nameInputRef}
          value={timerName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTimerName(e.target.value)}
          placeholder="타이머 이름"
          autoComplete="off"
          inputMode="text"
          className="w-full px-0 py-3 text-lg border-0 border-b-2 border-gray-200 focus:border-subYello3 focus:outline-none bg-transparent"
        />
      </div>

      {/* 타이머 시간 선택 */}
      <div className="mb-8 flex-1">
        <label className="block text-gray-600 text-sm mb-4">타이머 시간 *</label>

        <div className="relative">
          <div className="absolute bg-100 left-0 right-0 top-1/2 transform -translate-y-1/2 h-12 rounded-lg pointer-events-none z-0"></div>

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
              const scale = isSelected ? 'scale-110' : 'scale-100';
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
                  <div className={`transform ${scale}`}>{formatTime(minutes)}</div>
                </div>
              );
            })}
            <div className="h-24" />
          </div>
        </div>
      </div>

      {/* 저장 버튼 - 키보드 위에 고정 */}
      <div
        className="w-full left-0 right-0 bg-white "
        style={{
          position: 'fixed',
          bottom: `${keyboardOffset > 0 ? keyboardOffset : 0}px`,
          transition: 'bottom 0.2s ease',
        }}
      >
        <button
          className={`w-full py-4  font-medium text-lg transition-colors ${
            timerName.trim()
              ? 'bg-subYello3 text-gray-800 hover:bg-subYello3'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          disabled={!timerName.trim() || isPending}
          onClick={handleSave}
        >
          저장
        </button>
      </div>
    </div>
  );
}
