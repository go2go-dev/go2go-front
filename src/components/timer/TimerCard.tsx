import PlayButtonSvg from '@/assets/svg/playCircleOutline.svg?react';
import CharacterSVG from '@/assets/svg/characterImage.svg?react';
import type { Timer } from '@/constants/types';

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
  return (
    <div className="bg-main  rounded-2xl p-4 relative">
      <div className="text-sm text-gray-700 mb-2">{timer.name}</div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CharacterSVG />
          <div>
            <div className="text-2xl font-bold text-gray-800">{formatTime(timer.minutes)}</div>
            <div className="text-gray-600">...</div>
          </div>
        </div>
        <PlayButtonSvg />
      </div>
    </div>
  );
}
