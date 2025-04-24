import { Link } from 'react-router';

import { Icon, IconX } from '@tabler/icons-react';
import { motion } from 'framer-motion';

import { Sidebar, UIConfig } from 'erxes-ui';

import { AppPath } from '@/types/paths/AppPath';
import { CORE_MODULES } from '~/plugins/constants/core-plugins.constants';
import { pluginsConfigState } from 'ui-modules';
import { useAtomValue } from 'jotai';
import { SETTINGS_PATH_DATA } from '../constants/data';
import { MainNavigationButton } from '@/navigation/components/MainNavigationBar';
import { useMemo } from 'react';

export function SettingsSidebar() {
  const pluginsMetaData = useAtomValue(pluginsConfigState) || {};

  const modules = useMemo(() => {
    const coreModules = [
      ...CORE_MODULES.filter((module) => module.haveSettings),
    ];

    if (pluginsMetaData) {
      const settingsModules = Object.values(pluginsMetaData || {}).flatMap(
        (plugin) =>
          plugin.modules
            .filter((module) => module.haveSettings)
            .map((module) => ({
              ...module,
              pluginName: plugin.name,
            })),
      );

      return [...coreModules, ...settingsModules] as UIConfig['modules'];
    }
    return coreModules;
  }, [pluginsMetaData]);

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
              {SETTINGS_PATH_DATA.account.map((item) => (
                <MainNavigationButton
                  key={item.name}
                  pathPrefix={AppPath.Settings}
                  pathname={'/' + item.path}
                  name={item.name}
                  icon={item.icon}
                />
              ))}
            </Sidebar.Menu>
          </Sidebar.GroupContent>
        </Sidebar.Group>
        <Sidebar.Group>
          <Sidebar.GroupLabel>Workspace Settings</Sidebar.GroupLabel>
          <Sidebar.GroupContent>
            <Sidebar.Menu>
              {SETTINGS_PATH_DATA.nav.map((item) => (
                <Sidebar.MenuItem key={item.name}>
                  <MainNavigationButton
                    pathPrefix={AppPath.Settings}
                    pathname={'/' + item.path}
                    name={item.name}
                    icon={item.icon}
                  />
                </Sidebar.MenuItem>
              ))}
            </Sidebar.Menu>
          </Sidebar.GroupContent>
        </Sidebar.Group>

        <Sidebar.Group>
          <Sidebar.GroupLabel>PLugins Settings</Sidebar.GroupLabel>
          <Sidebar.GroupContent>
            <Sidebar.Menu>
              {modules.map((item) => (
                <Sidebar.MenuItem key={item.name}>
                  <MainNavigationButton
                    pathPrefix={AppPath.Settings}
                    pathname={item.path}
                    name={item.name}
                    icon={item.icon as Icon}
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
