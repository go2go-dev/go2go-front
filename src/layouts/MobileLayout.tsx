import React from 'react';
import { useLocation } from 'react-router-dom';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const location = useLocation();
  const isTodoPage = location.pathname === '/todo'; // 경로 비교

  return (
    <div
      className={`flex flex-row justify-center w-full min-h-dvh relative px-5  max-w-md mx-auto ${isTodoPage ? 'bg-100' : 'bg-white'}`}
    >
      {children}
    </div>
  );
}
