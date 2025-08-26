import { useNavigate } from 'react-router';

import { IconChevronLeft } from '@tabler/icons-react';

import { Sidebar, IUIConfig, NavigationMenuLinkItem } from 'erxes-ui';

import { AppPath } from '@/types/paths/AppPath';
import { CORE_MODULES } from '~/plugins/constants/core-plugins.constants';
import { pluginsConfigState } from 'ui-modules';
import { useAtomValue } from 'jotai';
import { SETTINGS_PATH_DATA } from '../constants/data';

import { useMemo } from 'react';
import { usePageTrackerStore } from 'react-page-tracker';

export function SettingsSidebar() {
  const pluginsMetaData = useAtomValue(pluginsConfigState) || {};

  const pluginsWithSettingsModules: Map<string, IUIConfig['modules']> =
    useMemo(() => {
      if (pluginsMetaData) {
        const groupedModules = new Map<string, IUIConfig['modules']>();

        Object.values(pluginsMetaData).forEach((plugin) => {
          const settingsModules = plugin.modules
            .filter((module) => module.hasSettings || module.settingsOnly)
            .map((module) => ({
              ...module,
              pluginName: plugin.name,
            }));

          if (settingsModules.length > 0) {
            groupedModules.set(plugin.name, settingsModules);
          }
        });

        return groupedModules;
      }
      return new Map();
    }, [pluginsMetaData]);

  return (
    <>
      <Sidebar.Content className="styled-scroll gap-2">
        <SettingsExitButton />
        <SettingsNavigationGroup name="Account">
          {SETTINGS_PATH_DATA.account.map((item) => (
            <NavigationMenuLinkItem
              key={item.name}
              pathPrefix={AppPath.Settings}
              path={item.path}
              name={item.name}
            />
          ))}
        </SettingsNavigationGroup>
        <SettingsNavigationGroup name="Workspace">
          {SETTINGS_PATH_DATA.nav.map((item) => (
            <Sidebar.MenuItem key={item.name}>
              <NavigationMenuLinkItem
                pathPrefix={AppPath.Settings}
                path={item.path}
                name={item.name}
              />
            </Sidebar.MenuItem>
          ))}
        </SettingsNavigationGroup>

        <SettingsNavigationGroup name="Core modules">
          {CORE_MODULES.filter((item) => item.hasSettings).map((item) => (
            <Sidebar.MenuItem key={item.name}>
              <NavigationMenuLinkItem
                pathPrefix={AppPath.Settings}
                path={item.path}
                name={item.name}
              />
            </Sidebar.MenuItem>
          ))}
        </SettingsNavigationGroup>

        {Array.from(pluginsWithSettingsModules.entries()).map(
          ([pluginName, modules]) => (
            <SettingsNavigationGroup
              key={pluginName}
              name={pluginName.charAt(0).toUpperCase() + pluginName.slice(1)}
            >
              {modules.map((item) => (
                <Sidebar.MenuItem key={item.name}>
                  <NavigationMenuLinkItem
                    pathPrefix={AppPath.Settings}
                    path={item.path}
                    name={item.name}
                  />
                </Sidebar.MenuItem>
              ))}
            </SettingsNavigationGroup>
          ),
        )}
      </Sidebar.Content>
    </>
  );
}

export const SettingsNavigationGroup = ({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) => {
  return (
    <Sidebar.Group>
      <Sidebar.GroupLabel className="h-4">{name}</Sidebar.GroupLabel>
      <Sidebar.GroupContent className="pt-1">
        <Sidebar.Menu>{children}</Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  );
};

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
          <Sidebar.MenuButton onClick={handleExitSettings}>
            <IconChevronLeft />
            <span>Exit Settings</span>
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Header>
  );
};
