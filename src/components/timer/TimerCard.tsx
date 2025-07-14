// components/timer/TimerCard.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PlayButtonSVG from '@/assets/svg/playCircleOutline.svg?react';
import CharacterSVG from '@/assets/svg/characterImage.svg?react';
import DeleteSVG from '@/assets/svg/delete.svg?react';
import TimerDeleteModal from './TimerDeleteModal';
import type { Timer } from '@/constants/types';
import { useStartTimer } from '@/hooks/useStartTimer';
import { useDeleteTimer } from '@/hooks/useDeleteTimer';
import { useNavigate } from 'react-router-dom';

interface TimerCardProps {
  timer: Timer;
}

export default function TimerCard({ timer }: TimerCardProps) {
  const { mutate: startTimer, isPending: isStarting } = useStartTimer();
  const { mutate: deleteTimer, isPending: isDeleting } = useDeleteTimer();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleStart = () => {
    if (isStarting) return;
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

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    deleteTimer(timer.timerId, {
      onSuccess: () => {
        console.log('타이머 삭제 완료:', timer.timerId);
      },
      onError: () => {
        alert('타이머 삭제에 실패했습니다.');
        setShowDeleteModal(false);
      },
    });
  };

  return (
    <>
      <motion.div
        className="bg-main rounded-2xl pt-4 pb-2 relative cursor-pointer overflow-hidden"
        onClick={handleStart}
        whileHover={{
          scale: 1.03,
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
          transition: { duration: 0.2 },
        }}
        whileTap={{
          scale: 0.97,
          transition: { duration: 0.1 },
        }}
        animate={{
          opacity: 1,
          y: 0,
          ...(isPressed ? { scale: 0.95 } : {}),
        }}
        onTapStart={() => setIsPressed(true)}
        onTap={() => setIsPressed(false)}
        onTapCancel={() => setIsPressed(false)}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        {/* 로딩 오버레이 */}
        <AnimatePresence>
          {isStarting && (
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-2xl z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 삭제 중 오버레이 */}
        <AnimatePresence>
          {isDeleting && (
            <motion.div
              className="absolute inset-0 bg-red-500 bg-opacity-20 rounded-2xl z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>

        <motion.div
          className="text-body3 text-black pl-3 mb-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          {timer.name}
        </motion.div>

        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <motion.div
              whileHover={{
                scale: 1.1,
                rotate: 5,
                transition: { type: 'spring', stiffness: 300 },
              }}
            >
              <CharacterSVG />
            </motion.div>
          </motion.div>

          <motion.div
            className="flex flex-col items-end pr-4 gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            {/* 재생 버튼 */}
            <motion.div
              whileHover={{
                scale: 1.15,
                transition: { type: 'spring', stiffness: 400 },
              }}
              whileTap={{ scale: 0.9 }}
            >
              <PlayButtonSVG />
            </motion.div>

            {/* 시간 표시 */}
            <motion.div
              className="title-h1 font-bold text-gray-800"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              whileHover={{
                scale: 1.05,
                color: '#4F46E5',
                transition: { duration: 0.2 },
              }}
            >
              {timer.minutes}분
            </motion.div>

            {/* 삭제 버튼 */}
            <motion.div
              onClick={handleDeleteClick}
              className={`cursor-pointer ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
              whileHover={
                !isDeleting
                  ? {
                      scale: 1.2,
                      rotate: 15,
                      transition: { type: 'spring', stiffness: 300 },
                    }
                  : {}
              }
              whileTap={
                !isDeleting
                  ? {
                      scale: 0.8,
                      rotate: -15,
                      transition: { duration: 0.1 },
                    }
                  : {}
              }
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <motion.div
                animate={
                  isDeleting
                    ? {
                        opacity: [1, 0.5, 1],
                        scale: [1, 0.9, 1],
                        transition: { repeat: Infinity, duration: 1 },
                      }
                    : {}
                }
              >
                <DeleteSVG />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* 삭제 모달 애니메이션 */}
      <AnimatePresence>
        {showDeleteModal && (
          <TimerDeleteModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onDelete={handleDeleteConfirm}
            timerName={timer.name}
          />
        )}
      </AnimatePresence>
    </>
  );
}
