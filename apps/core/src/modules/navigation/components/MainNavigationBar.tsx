import { Sidebar } from 'erxes-ui';
import { User } from './User';
import { Organization } from './Organization';
import { Mail, PieChart, SquareCheck, Users } from 'lucide-react';
import { SidebarNavigation } from './SidebarNavigation';
import { QuickActions } from '@/quickActions/components/QuickActions';
import { SettingsSidebar } from '@/settings/components/SettingsSidebar';
import { useIsSettings } from '../hooks/useIsSettings';

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
      <>
        <Sidebar.Header>
          <Organization />
          <div className="flex">
            <QuickActions />
          </div>
        </Sidebar.Header>
        <Sidebar.Content>
          {navItems.map((item) => (
            <SidebarNavigation
              key={item.label}
              label={item.label}
              items={item.items}
            />
          ))}
        </Sidebar.Content>
        <Sidebar.Footer>
          <User />
        </Sidebar.Footer>
      </>
    );
  };
  return (
    <Sidebar.Provider>
      <Sidebar.Root collapsible="offcanvas" variant="inset">
        {renderSidebarContent()}
        <Sidebar.Rail />
      </Sidebar.Root>
      <Sidebar.Inset>{children}</Sidebar.Inset>
    </Sidebar.Provider>
  );
};

const navItems = [
  {
    label: 'favorites',
    items: [
      {
        title: 'teamInbox',
        url: '/inbox',
        icon: Mail,
        isActive: true,
        items: [
          {
            title: 'inbox',
            url: '/inbox',
          },
          {
            title: 'starred',
            url: '/inbox/starred',
          },
          {
            title: 'settings',
            url: '/inbox/settings',
          },
        ],
      },
      {
        title: 'tasks',
        url: '/tasks',
        icon: SquareCheck,
        items: [
          {
            title: 'teams',
            url: '/tasks/teams',
          },
          {
            title: 'projects',
            url: '/tasks/projects',
          },
          {
            title: 'views',
            url: '/tasks/views',
          },
        ],
      },
    ],
  },
  {
    label: 'projects',
    items: [
      {
        title: 'contacts',
        url: '/contacts',
        icon: Users,
      },
      {
        title: 'insights',
        url: '/insights',
        icon: PieChart,
      },
    ],
  },
];
