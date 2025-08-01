import { Outlet } from 'react-router-dom';
import MobileLayout from './MobileLayout';
import { useNativeMessage } from '@/hooks/useNativeMessage';

export default function Layout() {
  useNativeMessage();

  return (
    <MobileLayout>
      <Outlet />
    </MobileLayout>
  );
}
