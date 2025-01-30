import { Link } from 'react-router';

import {
  IconBuildingStore,
  IconCaretUpFilled,
  IconInbox,
  IconSettings,
} from '@tabler/icons-react';
import { Button, Collapsible, Sidebar } from 'erxes-ui';
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
        <Sidebar.Header className="pt-4 pb-3 border-input">
          <Organization />
        </Sidebar.Header>
        <Sidebar.Separator className="mx-0" />
        <Sidebar.Content className="gap-0">
          {/* <Collapsible defaultOpen className="group/collapsible">
            <Sidebar.Group>
              <Sidebar.GroupLabel asChild className="hover:bg-zinc-200">
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
                        <IconInbox />
                        <span>Team Inbox</span>
                      </Sidebar.MenuButton>
                    </Sidebar.MenuItem>
                  </Sidebar.Menu>
                </Sidebar.GroupContent>
              </Collapsible.Content>
            </Sidebar.Group>
          </Collapsible> */}
          <Sidebar.Separator className="mx-0" />
          <SidebarNavigation />
        </Sidebar.Content>
        <Sidebar.Separator className="mx-0" />
        <Sidebar.Footer className="pb-5 pt-0">
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
          <User />
        </Sidebar.Footer>
      </motion.div>
    );
  };
  return (
    <Sidebar.Provider>
      <Sidebar collapsible="offcanvas" variant="inset">
        <AnimatePresence>{renderSidebarContent()}</AnimatePresence>
        <Sidebar.Rail />
      </Sidebar>
      <Sidebar.Inset className="h-[calc(100svh-theme(spacing.4))] flex-grow-0 flex-shrink basis-full overflow-hidden">
        {children}
      </Sidebar.Inset>
    </Sidebar.Provider>
  );
};
