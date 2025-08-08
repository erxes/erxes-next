import { NavigationMenuGroup, NavigationMenuLinkItem, Sidebar } from 'erxes-ui';
import { Organization } from './Organization';
import { SidebarNavigationFavorites } from './SidebarNavigationFavorites';
import { MyInboxMainNavigationBarItem } from '@/notification/my-inbox/components/MyInboxMainNavigationBarItem';
import { NavigationCoreModules } from '@/navigation/components/NavigationCoreModules';
import {
  NavigationPluginActions,
  NavigationPluginExitButton,
  NavigationPlugins,
} from '@/navigation/components/NavigationPlugins';
import { IconCode } from '@tabler/icons-react';

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
        <NavigationPluginExitButton />
        <MyInboxMainNavigationBarItem />
        {process.env.NODE_ENV === 'development' && <DevelopmentNavigation />}
        <SidebarNavigationFavorites />
        <NavigationPlugins />
        <NavigationCoreModules />
        <NavigationPluginActions />
      </Sidebar.Content>
    </>
  );
};

export const DevelopmentNavigation = () => {
  return (
    <NavigationMenuGroup name="Development">
      <NavigationMenuLinkItem
        name="components"
        icon={IconCode}
        path="components"
      />
    </NavigationMenuGroup>
  );
};

export default MainNavigationBar;
