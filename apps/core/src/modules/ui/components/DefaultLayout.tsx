import { Outlet } from 'react-router-dom';
import { MainNavigationBar } from '@/navigation/components/MainNavigationBar';

export const DefaultLayout = () => {
  return (
    <MainNavigationBar>
      <Outlet />
    </MainNavigationBar>
  );
};
