import { MainNavigationBar } from '@/navigation/components/MainNavigationBar';
import { SettingsSidebar } from '@/settings/components/SettingsSidebar';
import { Sidebar } from 'erxes-ui';
import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router';

export const DefaultLayout = () => {
  const location = useLocation();
  const isSettings = location.pathname.includes('/settings');
  return (
    <Sidebar.Provider className="w-screen">
      <Sidebar collapsible="offcanvas" variant="sidebar" className="p-0">
        <SidebarAnimationContainer isSettings={isSettings}>
          {isSettings ? <SettingsSidebar /> : <MainNavigationBar />}
        </SidebarAnimationContainer>
        <Sidebar.Rail />
      </Sidebar>
      <Sidebar.Inset className="h-[calc(100svh-theme(spacing.4))] flex-grow-0 flex-shrink basis-full overflow-hidden shadow-sidebar-inset">
        <Outlet />
      </Sidebar.Inset>
    </Sidebar.Provider>
  );
};
export const SidebarAnimationContainer = ({
  children,
  isSettings,
}: {
  children: React.ReactNode;
  isSettings: boolean;
}) => {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={isSettings ? 'settings' : 'main'}
        initial={{ opacity: 0, x: isSettings ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex h-full w-full flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
