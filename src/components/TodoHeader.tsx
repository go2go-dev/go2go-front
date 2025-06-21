import { type ReactNode } from 'react';
import PlusBtn from '@/assets/svg/plusIcon.svg?react';
import BackBtn from '@/assets/svg/backBtnIcon.svg?react';

interface TodoHeaderProps {
  title: string;
  onLeftClick?: () => void;
  onRightClick?: () => void;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export default function TodoHeader({
  title,
  onLeftClick,
  onRightClick,
  leftIcon = <BackBtn />, // 기본값
  rightIcon = <PlusBtn />, // 기본값
}: TodoHeaderProps) {
  return (
    <div className="flex justify-between items-center pt-5 pb-5">
      <button onClick={onLeftClick} type="button">
        {leftIcon}
      </button>
      <h1 className="text-body2 text-center justify-start ">{title}</h1>
      <button onClick={onRightClick} type="button">
        {rightIcon}
      </button>
    </div>
  );
}
