import { Outlet } from 'react-router-dom';
import { SidebarMain } from '~/components/Sidebar';

export const DefaultLayout = () => {
  return (
    <SidebarMain>
      <Outlet />
    </SidebarMain>
  );
};
