import PlayButtonSVG from '@/assets/svg/playCircleOutline.svg?react';
import CharacterSVG from '@/assets/svg/characterImage.svg?react';
import DeleteSVG from '@/assets/svg/delete.svg?react';
import type { Timer } from '@/constants/types';
import { useStartTimer } from '@/hooks/useStartTimer';
import { useNavigate } from 'react-router-dom';

interface TimerCardProps {
  timer: Timer;
}

const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}분`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes === 0 ? `${hours}시간` : `${hours}시간 ${remainingMinutes}분`;
  }
};

export default function TimerCard({ timer }: TimerCardProps) {
  const { mutate: startTimer, isPending } = useStartTimer();
  const navigate = useNavigate();

  const handleStart = () => {
    if (isPending) return;
    startTimer(timer.timerId, {
      onSuccess: () => {
        navigate(`/countdown/${timer.timerId}`, {
          state: { name: timer.name, minutes: timer.minutes },
        });
      },
      onError: () => {
        alert('타이머 시작 실패');
      },
    });
  };

  return (
    <div className="bg-main rounded-2xl pt-4 pb-2 relative cursor-pointer" onClick={handleStart}>
      <div className="text-body3 text-black pl-3 mb-2">{timer.name}</div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CharacterSVG />
        </div>
        <div className="flex flex-col items-end pr-4 gap-2">
          <PlayButtonSVG />
          <div className="text-2xl font-bold text-gray-800">{formatTime(timer.minutes)}</div>
          <DeleteSVG />
        </div>
      </div>
    </div>
  );
}
