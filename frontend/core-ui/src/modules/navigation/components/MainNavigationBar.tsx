import { Sidebar } from 'erxes-ui';
import { Organization } from './Organization';
import { SidebarNavigation } from './SidebarNavigation';
import { SidebarNavigationFavorites } from './SidebarNavigationFavorites';
import { User } from './User';
import { Notification } from '@/notification/components/Notification';

export const MainNavigationBar = () => {
  return (
    <>
      <Sidebar.Header className="px-2 h-[52px] justify-center">
        <Sidebar.Menu>
          <Sidebar.MenuItem className="flex gap-2 items-center">
            <Organization />
            <Notification />
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.Header>
      <Sidebar.Separator className="mx-0" />

      <Sidebar.Content className="gap-0">
        <SidebarNavigationFavorites />
        <SidebarNavigation />
      </Sidebar.Content>
      <Sidebar.Separator className="mx-0" />
      <Sidebar.Footer className="pb-4 px-0">
        <User />
      </Sidebar.Footer>
    </>
  );
};
