import { Outlet } from 'react-router-dom';
import MobileLayout from './MobileLayout';

export default function Layout() {
  return (
    <MobileLayout>
      <Outlet />
    </MobileLayout>
  );
}
