import { Link } from 'react-router';

import { IconBuildingStore, IconSettings } from '@tabler/icons-react';
import { Button, Sidebar } from 'erxes-ui';
import { Organization } from './Organization';
import { SidebarNavigation } from './SidebarNavigation';
import { User } from './User';
import { QuickActions } from '@/quickActions/components/QuickActions';

export const MainNavigationBar = () => {
  return (
    <>
      <Sidebar.Header className="px-4 h-[52px] justify-center">
        <Organization />
      </Sidebar.Header>
      <Sidebar.Separator className="mx-0" />
      <Sidebar.Content className="gap-0">
        <SidebarNavigation />
      </Sidebar.Content>
      <Sidebar.Separator className="mx-0" />
      <Sidebar.Footer className="pb-5 px-0">
        <Sidebar.Group className="pt-0">
          <Sidebar.GroupLabel>Shortcut actions</Sidebar.GroupLabel>
          <Sidebar.GroupContent className="grid grid-cols-2 gap-2">
            <Button variant="secondary" asChild>
              <Link to="/settings">
                <IconSettings />
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/marketplace">
                <IconBuildingStore />
              </Link>
            </Button>
            <QuickActions />
          </Sidebar.GroupContent>
        </Sidebar.Group>
        <Sidebar.Separator className="mx-0" />
        <User />
      </Sidebar.Footer>
    </>
  );
};
