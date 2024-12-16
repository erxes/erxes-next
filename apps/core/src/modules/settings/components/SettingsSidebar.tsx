import { Link, useLocation } from 'react-router-dom';
import { Sidebar } from 'erxes-ui/components';
import { Settings2, XIcon, CircleUserRound, SwatchBook } from 'lucide-react';
import { useRecoilValue } from 'recoil';
import { SettingsPath } from '@/types/SettingsPath';
import { AppPath } from '@/types/AppPath';
import { motion } from 'framer-motion';
import { pluginsState } from '@/navigation/states/navigationStates';
import { PLUGINS } from '@/navigation/constants/plugins';
import { useTranslation } from 'react-i18next';
const data = {
  account: [
    {
      name: 'Profile',
      icon: CircleUserRound,
      path: SettingsPath.Profile,
    },
    {
      name: 'Experience',
      icon: SwatchBook,
      path: SettingsPath.Experience,
    },
  ],
  nav: [{ name: 'General', icon: Settings2 }],
};

export function SettingsSidebar() {
  const plugins = useRecoilValue(pluginsState);
  const pinnedPlugins = plugins.filter((plugin) => plugin.pinned);

  const windowPlugins = window.plugins;

  windowPlugins.map((plugin) => {
    pinnedPlugins.push({
      handle: plugin.name,
      pinned: true,
    });
  });

  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex h-full w-full flex-col"
    >
      <Sidebar.Header className="pb-0">
        <Sidebar.Menu>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton className="h-10" asChild>
              <Link to="/">
                <XIcon />
                <span>Exit Settings</span>
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
              {data.account.map((item) => (
                <SideBarItem key={item.name} item={item} />
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
          <Sidebar.GroupLabel>PLugins Settings</Sidebar.GroupLabel>
          <Sidebar.GroupContent>
            <Sidebar.Menu>
              {pinnedPlugins.map((item) => {
                const Icon = PLUGINS[item.handle].icon;
                return (
                  <Sidebar.MenuItem key={item.handle}>
                    <Sidebar.MenuButton asChild>
                      <Link to={AppPath.Settings + '/' + item.handle}>
                        {Icon && <Icon />}
                        <span>{t('nav.' + PLUGINS[item.handle].title)}</span>
                      </Link>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                );
              })}
            </Sidebar.Menu>
          </Sidebar.GroupContent>
        </Sidebar.Group>
      </Sidebar.Content>
    </motion.div>
  );
}

const SideBarItem = ({ item }: { item: (typeof data.account)[0] }) => {
  const location = useLocation();
  return (
    <Sidebar.MenuItem key={item.name}>
      <Sidebar.MenuButton
        asChild
        isActive={
          location.pathname === '/' + AppPath.Settings + '/' + item.path
        }
      >
        <Link to={AppPath.Settings + '/' + item.path}>
          <item.icon />
          <span>{item.name}</span>
        </Link>
      </Sidebar.MenuButton>
    </Sidebar.MenuItem>
  );
};
