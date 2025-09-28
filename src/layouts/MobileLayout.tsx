import React from 'react';
import { useLocation } from 'react-router-dom';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const location = useLocation();
  const isTodoPage = location.pathname === '/todo';
  const isADHDPage = location.pathname === '/adhd';
  const isTimerDetailPage =
    location.pathname.includes('/timer/') && location.pathname.endsWith('/detail');

  return (
    <div
      className={`flex flex-row justify-center w-full min-h-dvh relative max-w-md mx-auto ${
        isTodoPage ? 'bg-100' : 'bg-white'
      } ${isTimerDetailPage ? '' : 'px-5'}
    ${isADHDPage ? 'bg-gray10' : 'bg-white'}
      `}
    >
      {children}
    </div>
  );
}
