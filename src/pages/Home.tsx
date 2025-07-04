import { User, ChevronRight } from 'lucide-react';
import TimerList from '@/components/timer/TimerList';
import type { Timer } from '@/constants/types';
import { useNavigate } from 'react-router-dom';

export default function TimerApp() {
  const navigate = useNavigate();

  const timerList: Timer[] = [
    { timerId: 1, name: '책읽기', minutes: 25 },
    { timerId: 2, name: '운동하기', minutes: 110 },
    { timerId: 3, name: '코딩 공부하기', minutes: 35 },
    { timerId: 4, name: '영어 공부', minutes: 45 },
    { timerId: 5, name: '명상하기', minutes: 15 },
  ];

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen">
      {/* 헤더 */}
      <div className="flex justify-between items-center pb-5 pt-12">
        <h1 className="text-h2 text-black">타이머</h1>
        <User className="w-6 h-6 text-gray-600" />
      </div>

      {/* 타이머 리스트 */}
      <TimerList timers={timerList} />

      {/* 타이머 추가 버튼 */}
      <div className="mt-8">
        <button
          onClick={() => navigate('/addTimer')}
          className="w-full bg-gray-700 text-white py-4 rounded-2xl font-medium text-lg"
        >
          타이머 추가
        </button>
      </div>

      {/* 하단 메뉴 */}
      <div className="mt-8 mb-4">
        <div className="bg-100 p-4 flex items-center justify-between py-4 rounded-xl">
          <div className="text-body2 text-black">먼지 치우기</div>
          <div className="text-body4 text-500">할 일을 적고 해치워봐요</div>

          <ChevronRight className="w-5 h-5 text-black" onClick={() => navigate('/todo')} />
        </div>
      </div>
    </div>
  );
}
