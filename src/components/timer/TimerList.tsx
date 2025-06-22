import TimerCard from './TimerCard';
import type { Timer } from '@/constants/types';

interface TimerListProps {
  timers: Timer[];
}

export default function TimerList({ timers }: TimerListProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {timers.map((timer) => (
          <TimerCard key={timer.timerId} timer={timer} />
        ))}
        {timers.length % 2 !== 0 && <div></div>}
      </div>
    </div>
  );
}
