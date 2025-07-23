import { Sidebar } from 'erxes-ui';
import { Organization } from './Organization';
import { SidebarNavigation } from './SidebarNavigation';
import { SidebarNavigationFavorites } from './SidebarNavigationFavorites';
import { User } from './User';
import { SidebarNavigationComponents } from './SidebarNavigationComponents';
import { MyInboxMainNavigationBarItem } from '@/notification/my-inbox/components/MyInboxMainNavigationBarItem';

export const MainNavigationBar = () => {
  return (
    <>
      <Sidebar.Header className="px-2 h-[52px] justify-center">
        <Sidebar.Menu>
          <Sidebar.MenuItem className="flex gap-2 items-center">
            <Organization />
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.Header>
      <Sidebar.Separator className="mx-0" />

      <Sidebar.Content className="gap-0">
        {process.env.NODE_ENV === 'development' && (
          <SidebarNavigationComponents />
        )}
        <MyInboxMainNavigationBarItem />

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
