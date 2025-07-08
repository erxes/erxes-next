import { useNavigate } from 'react-router';

import { Icon, IconX } from '@tabler/icons-react';

import { Sidebar, IUIConfig } from 'erxes-ui';

import { AppPath } from '@/types/paths/AppPath';
import { CORE_MODULES } from '~/plugins/constants/core-plugins.constants';
import { pluginsConfigState } from 'ui-modules';
import { useAtomValue } from 'jotai';
import { SETTINGS_PATH_DATA } from '../constants/data';
import { NavigationButton } from '@/navigation/components/NavigationButton';

import { useMemo } from 'react';
import { usePageTrackerStore } from 'react-page-tracker';

export function SettingsSidebar() {
  const pluginsMetaData = useAtomValue(pluginsConfigState) || {};

  const modules = useMemo(() => {
    const coreModules = [
      ...CORE_MODULES.filter((module) => module.hasSettings),
    ];

    if (pluginsMetaData) {
      const settingsModules = Object.values(pluginsMetaData || {}).flatMap(
        (plugin) =>
          plugin.modules
            .filter((module) => module.hasSettings)
            .map((module) => ({
              ...module,
              pluginName: plugin.name,
            })),
      );

      return [...coreModules, ...settingsModules] as IUIConfig['modules'];
    }
    return coreModules;
  }, [pluginsMetaData]);

  return (
    <>
      <SettingsExitButton />
      <Sidebar.Content className="styled-scroll">
        <Sidebar.Group>
          <Sidebar.GroupLabel>Account Settings</Sidebar.GroupLabel>
          <Sidebar.GroupContent>
            <Sidebar.Menu>
              {SETTINGS_PATH_DATA.account.map((item) => (
                <NavigationButton
                  key={item.name}
                  pathPrefix={AppPath.Settings}
                  pathname={item.path}
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
                  <NavigationButton
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

        <Sidebar.Group>
          <Sidebar.GroupLabel>Module Settings</Sidebar.GroupLabel>
          <Sidebar.GroupContent>
            <Sidebar.Menu>
              {modules.map((item) => (
                <Sidebar.MenuItem key={item.name}>
                  <NavigationButton
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
    </>
  );
}

export const SettingsExitButton = () => {
  const navigate = useNavigate();
  const pageHistory = usePageTrackerStore((state) => state.pageHistory);

  const handleExitSettings = () =>
    navigate(
      pageHistory.reverse().find((page) => !page.includes('settings')) || '/',
    );

  return (
    <Sidebar.Header className="pb-0 px-4">
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <Sidebar.MenuButton className="h-10" onClick={handleExitSettings}>
            <IconX />
            <span>Exit Settings</span>
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Header>
  );
};
