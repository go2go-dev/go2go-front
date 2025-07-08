import { useState } from 'react';
import PlayButtonSVG from '@/assets/svg/playCircleOutline.svg?react';
import CharacterSVG from '@/assets/svg/characterImage.svg?react';
import DeleteSVG from '@/assets/svg/delete.svg?react';
import TimerDeleteModal from './TimerDeleteModal';
import type { Timer } from '@/constants/types';
import { useStartTimer } from '@/hooks/useStartTimer';
import { useDeleteTimer } from '@/hooks/useDeleteTimer'; // 추가
import { useNavigate } from 'react-router-dom';

interface TimerCardProps {
  timer: Timer;
}

export default function TimerCard({ timer }: TimerCardProps) {
  const { mutate: startTimer, isPending: isStarting } = useStartTimer();
  const { mutate: deleteTimer, isPending: isDeleting } = useDeleteTimer(); // 추가
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
        // 모달은 성공시 자동으로 닫힘 (쿼리 무효화로 컴포넌트가 리렌더링됨)
      },
      onError: () => {
        alert('타이머 삭제에 실패했습니다.');
        setShowDeleteModal(false); // 실패시에만 수동으로 모달 닫기
      },
    });
  };

  return (
    <>
      <div className="bg-main rounded-2xl pt-4 pb-2 relative cursor-pointer" onClick={handleStart}>
        <div className="text-body3 text-black pl-3 mb-2">{timer.name}</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CharacterSVG />
          </div>
          <div className="flex flex-col items-end pr-4 gap-2">
            <PlayButtonSVG />
            <div className="title-h1 font-bold text-gray-800">{timer.minutes}분</div>
            <div
              onClick={handleDeleteClick}
              className={`cursor-pointer ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <DeleteSVG />
            </div>
          </div>
        </div>
      </div>

      {/* 삭제 모달 */}
      <TimerDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteConfirm}
        timerName={timer.name}
      />
    </>
  );
}
