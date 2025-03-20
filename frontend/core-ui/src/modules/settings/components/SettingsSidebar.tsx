import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { IconX } from '@tabler/icons-react';
import { motion } from 'framer-motion';

import { Sidebar } from 'erxes-ui';

import { AppPath } from '@/types/paths/AppPath';
import { CORE_PLUGINS } from '~/plugins/constants/core-plugins.constants';
import { pluginsConfigState } from 'ui-modules';
import { useAtomValue } from 'jotai';
import { SETTINGS_PATH_DATA } from '../constants/data';


export function SettingsSidebar() {
  const plugins = [...CORE_PLUGINS];

  const pluginsMetaData = useAtomValue(pluginsConfigState) || {};

  Object.keys(pluginsMetaData || {}).forEach((configId) => {
    plugins.push({
      path: '/' + configId.replace('_ui', ''),
      name: pluginsMetaData[configId].name,
      icon: pluginsMetaData[configId].icon,
    });
  });
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
                <IconX />
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
              {SETTINGS_PATH_DATA.account.map((item) => (
                <SideBarItem key={item.name} item={item} />
              ))}
            </Sidebar.Menu>
          </Sidebar.GroupContent>
        </Sidebar.Group>
        <Sidebar.Group>
          <Sidebar.GroupLabel>Workspace Settings</Sidebar.GroupLabel>
          <Sidebar.GroupContent>
            <Sidebar.Menu>
              {SETTINGS_PATH_DATA.nav.map((item) => (
                <SideBarItem key={item.name} item={item} />
              ))}
            </Sidebar.Menu>
          </Sidebar.GroupContent>
        </Sidebar.Group>

        <Sidebar.Group>
          <Sidebar.GroupLabel>PLugins Settings</Sidebar.GroupLabel>
          <Sidebar.GroupContent>
            <Sidebar.Menu>
              {plugins.map((item) => (
                <Sidebar.MenuItem key={item.name}>
                  <MainNavigationButton
                    pathPrefix={AppPath.Settings}
                    pathname={item.path}
                    name={item.name}
                    icon={item.icon}
                  />
                </Sidebar.MenuItem>
              ))}
            </Sidebar.Menu>
          </Sidebar.GroupContent>
        </Sidebar.Group>
      </Sidebar.Content>
    </motion.div>
  );
}

const SideBarItem = ({
  item,
}: {
  item:
    | (typeof SETTINGS_PATH_DATA.account)[0]
    | (typeof SETTINGS_PATH_DATA.nav)[0];
}) => {
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