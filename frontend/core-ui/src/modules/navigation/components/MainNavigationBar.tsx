import { Link, useLocation } from 'react-router';

import {
  Icon,
  IconBuildingStore,
  // IconCaretUpFilled,
  // IconMailFilled,
  IconSettings,
} from '@tabler/icons-react';
import { Button, cn, Sidebar } from 'erxes-ui';
import { AnimatePresence, motion } from 'motion/react';

import { Organization } from './Organization';
import { SidebarNavigation } from './SidebarNavigation';
import { User } from './User';
import { useIsSettings } from '../hooks/useIsSettings';

import { QuickActions } from '@/quickActions/components/QuickActions';
import { SettingsSidebar } from '@/settings/components/SettingsSidebar';

export const MainNavigationBar = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isSettings = useIsSettings();

  const renderSidebarContent = () => {
    if (isSettings) {
      return <SettingsSidebar />;
    }

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex h-full w-full flex-col"
      >
        <Sidebar.Header className="px-4 h-[52px] justify-center">
          <Organization />
        </Sidebar.Header>
        <Sidebar.Separator className="mx-0" />
        <Sidebar.Content className="gap-0">
          {/* <Collapsible defaultOpen className="group/collapsible">
            <Sidebar.Group>
              <Sidebar.GroupLabel asChild>
                <Collapsible.Trigger>
                  Favorites
                  <IconCaretUpFilled className="size-3.5 ml-1 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </Collapsible.Trigger>
              </Sidebar.GroupLabel>
              <Collapsible.Content>
                <Sidebar.GroupContent className="pt-2">
                  <Sidebar.Menu>
                    <Sidebar.MenuItem>
                      <Sidebar.MenuButton>
                        <IconMailFilled className="text-accent-foreground" />
                        <span>Team Inbox</span>
                      </Sidebar.MenuButton>
                    </Sidebar.MenuItem>
                  </Sidebar.Menu>
                </Sidebar.GroupContent>
              </Collapsible.Content>
            </Sidebar.Group>
          </Collapsible>
          <Sidebar.Separator className="mx-0" /> */}
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
      </motion.div>
    );
  };
  return (
    <Sidebar.Provider className="w-screen">
      <Sidebar collapsible="offcanvas" variant="sidebar" className="p-0">
        <AnimatePresence>{renderSidebarContent()}</AnimatePresence>
        <Sidebar.Rail />
      </Sidebar>
      <Sidebar.Inset className="h-[calc(100svh-theme(spacing.4))] flex-grow-0 flex-shrink basis-full overflow-hidden shadow-sidebar-inset">
        {children}
      </Sidebar.Inset>
    </Sidebar.Provider>
  );
};

export const MainNavigationButton = ({
  pathPrefix,
  pathname,
  name,
  icon,
}: {
  pathPrefix?: string;
  pathname: string;
  name: string;
  icon: Icon;
}) => {
  const Icon = icon;
  const activePathname = useLocation().pathname;
  const isActive = activePathname.includes(
    pathPrefix ? pathPrefix + pathname : pathname,
  );

  return (
    <Sidebar.MenuButton asChild isActive={isActive}>
      <Link to={pathPrefix ? pathPrefix + pathname : pathname}>
        <Icon
          className={cn('text-accent-foreground', isActive && 'text-primary')}
        />
        <span className="capitalize">{name}</span>
      </Link>
    </Sidebar.MenuButton>
  );
};
