import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';

import {
  IconAdjustmentsAlt,
  IconColorSwatch,
  IconFile,
  IconUserCircle,
  IconX,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';

import { Sidebar } from 'erxes-ui/components';

import { App } from '@/app/components/App';
import { AppPath } from '@/types/paths/AppPath';
import {
  SettingsPath,
  SettingsWorkspacePath,
} from '@/types/paths/SettingsPath';
import { CORE_PLUGINS } from '~/plugins/constants/core-plugins.constants';
import { pluginsConfigState } from 'ui-modules';
import { useAtomValue } from 'jotai';

const data = {
  account: [
    {
      name: 'Profile',
      icon: IconUserCircle,
      path: SettingsPath.Profile,
    },
    {
      name: 'Experience',
      icon: IconColorSwatch,
      path: SettingsPath.Experience,
    },
  ],
  nav: [
    { name: 'General', icon: IconAdjustmentsAlt },
    {
      name: 'File upload',
      icon: IconFile,
      path: SettingsWorkspacePath.FileUpload,
    },
  ],
};

export function SettingsSidebar() {
  const plugins = [...CORE_PLUGINS];

  const pluginsMetaData = useAtomValue(pluginsConfigState) || {};

  Object.keys(pluginsMetaData || {}).forEach((configId) => {
    plugins.push({
      path: `/${configId}`,
      name: pluginsMetaData[configId].name,
      icon: pluginsMetaData[configId].icon,
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
                  <Sidebar.MenuButton
                    asChild
                    isActive={
                      location.pathname === App + AppPath.Settings + item.path
                    }
                  >
                    <Link to={AppPath.Settings + '/' + item.path}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
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
              {plugins.map((item) => {
                const Icon = item.icon;
                return (
                  <Sidebar.MenuItem key={item.path}>
                    <Sidebar.MenuButton asChild>
                      <Link to={AppPath.Settings + item.path}>
                        {Icon && <Icon />}
                        <span>{t('nav.' + item.name)}</span>
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
