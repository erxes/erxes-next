import { Outlet } from 'react-router';

import { MainNavigationBar } from '@/navigation/components/MainNavigationBar';
import { WidgetsSidebar } from '@/widgets/WidgetsSidebar';

export const DefaultLayout = () => {
  return (
    <MainNavigationBar>
      <Outlet />
    </MainNavigationBar>
  );
};
