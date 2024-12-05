import { Sidebar } from 'erxes-ui';
import { User } from './User';
import { Organization } from './Organization';
import { SidebarNavigation } from './SidebarNavigation';
import { QuickActions } from '@/quickActions/components/QuickActions';
import { SettingsSidebar } from '@/settings/components/SettingsSidebar';
import { useIsSettings } from '../hooks/useIsSettings';
import { AnimatePresence, motion } from 'motion/react';

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
        <Sidebar.Header>
          <Organization />
          <div className="flex">
            <QuickActions />
          </div>
        </Sidebar.Header>
        <Sidebar.Content>
          <SidebarNavigation />
        </Sidebar.Content>
        <Sidebar.Footer>
          <User />
        </Sidebar.Footer>
      </motion.div>
    );
  };
  return (
    <Sidebar.Provider>
      <Sidebar.Root collapsible="offcanvas" variant="inset">
        <AnimatePresence>{renderSidebarContent()} </AnimatePresence>
        <Sidebar.Rail />
      </Sidebar.Root>
      <Sidebar.Inset className="h-[calc(100svh-theme(spacing.4))] flex-grow-0 flex-shrink basis-full overflow-hidden">
        {children}
      </Sidebar.Inset>
    </Sidebar.Provider>
  );
};
