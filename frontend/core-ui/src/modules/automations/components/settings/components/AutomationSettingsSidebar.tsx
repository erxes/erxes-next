import { Sidebar } from 'erxes-ui';
import { Link, useLocation } from 'react-router';

export const AutomationSettingsSidebar = () => {
  const activePath = useLocation().pathname;

  return (
    <Sidebar collapsible="none" className="border-r flex-none">
      <Sidebar.Group>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton
                isActive={activePath === '/settings/automations/bots'}
              >
                <Link to={`/bots`}>Bots</Link>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </Sidebar>
  );
};
