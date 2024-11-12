import { Link } from 'react-router-dom';
import { Sidebar } from 'erxes-ui';
import {
  ChevronLeft,
  Bell,
  Menu,
  Home,
  Paintbrush,
  MessageCircle,
  Globe,
  Keyboard,
  Check,
  Video,
  Lock,
  Settings,
  LinkIcon,
  Settings2,
} from 'lucide-react';

const data = {
  nav: [
    { name: 'General', icon: Settings2 },
    { name: 'Notifications', icon: Bell },
    { name: 'Navigation', icon: Menu },
    { name: 'Home', icon: Home },
    { name: 'Appearance', icon: Paintbrush },
    { name: 'Messages & media', icon: MessageCircle },
    { name: 'Language & region', icon: Globe },
    { name: 'Accessibility', icon: Keyboard },
    { name: 'Mark as read', icon: Check },
    { name: 'Audio & video', icon: Video },
    { name: 'Connected accounts', icon: LinkIcon },
    { name: 'Privacy & visibility', icon: Lock },
    { name: 'Advanced', icon: Settings },
  ],
};

export function SettingsSidebar() {
  return (
    <>
      <Sidebar.Header className="pb-0">
        <Sidebar.Menu>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton className="h-10" asChild>
              <Link to="/">
                <ChevronLeft />
                <span>Settings</span>
              </Link>
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.Header>
      <Sidebar.Content className="styled-scroll">
        <Sidebar.Group>
          <Sidebar.GroupLabel>Account Settings</Sidebar.GroupLabel>
          <Sidebar.GroupContent>
            <Sidebar.Menu>
              {data.nav.map((item) => (
                <Sidebar.MenuItem key={item.name}>
                  <Sidebar.MenuButton>
                    <item.icon />
                    <span>{item.name}</span>
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              ))}
            </Sidebar.Menu>
          </Sidebar.GroupContent>
        </Sidebar.Group>
        <Sidebar.Group>
          <Sidebar.GroupLabel>Workspace Settings</Sidebar.GroupLabel>
          <Sidebar.GroupContent>
            <Sidebar.Menu>
              {data.nav.map((item) => (
                <Sidebar.MenuItem key={item.name}>
                  <Sidebar.MenuButton>
                    <item.icon />
                    <span>{item.name}</span>
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              ))}
            </Sidebar.Menu>
          </Sidebar.GroupContent>
        </Sidebar.Group>
        <Sidebar.Group>
          <Sidebar.GroupLabel>Workspace Settings</Sidebar.GroupLabel>
          <Sidebar.GroupContent>
            <Sidebar.Menu>
              {data.nav.map((item) => (
                <Sidebar.MenuItem key={item.name}>
                  <Sidebar.MenuButton>
                    <item.icon />
                    <span>{item.name}</span>
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              ))}
            </Sidebar.Menu>
          </Sidebar.GroupContent>
        </Sidebar.Group>
      </Sidebar.Content>
    </>
  );
}
