import { motion, AnimatePresence } from 'framer-motion';
import TimerCard from './TimerCard';
import type { Timer } from '@/constants/types';

interface TimerListProps {
  timers: Timer[];
}

export default function TimerList({ timers }: TimerListProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {timers.map((timer, index) => (
            <motion.div
              key={timer.timerId}
              layout
              initial={{
                opacity: 0,
                scale: 0.8,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
                y: -20,
                transition: {
                  duration: 0.2,
                  ease: 'easeInOut',
                },
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
                delay: index * 0.1, // 순차적 애니메이션
                layout: {
                  duration: 0.3,
                  ease: 'easeInOut',
                },
              }}
            >
              <TimerCard timer={timer} />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* 홀수 개일 때 빈 공간 */}
        {timers.length % 2 !== 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          />
        )}
      </div>
    </div>
  );
}
