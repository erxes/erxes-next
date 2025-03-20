import { Sidebar } from 'erxes-ui';
import { Link, useLocation } from 'react-router';
import { settingsRoutes } from '../constants/settingsRoutes';

export const AccountingSidebar = () => {
  return (
    <Sidebar collapsible="none" className="border-r">
      <Sidebar.Group>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            {Object.entries(settingsRoutes).map(([path, label]) => (
              <AccountingSidebarItem key={path} to={path} children={label} />
            ))}
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </Sidebar>
  );
};

export const AccountingSidebarItem = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => {
  const isActive = useLocation().pathname === to;
  return (
    <Sidebar.MenuItem>
      <Sidebar.MenuButton asChild isActive={isActive}>
        <Link to={to}>{children}</Link>
      </Sidebar.MenuButton>
    </Sidebar.MenuItem>
  );
};
