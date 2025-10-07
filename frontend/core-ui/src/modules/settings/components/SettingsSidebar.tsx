import { useNavigate } from 'react-router-dom';

import { IconChevronLeft } from '@tabler/icons-react';

import { Sidebar, NavigationMenuLinkItem } from 'erxes-ui';

import { AppPath } from '@/types/paths/AppPath';
import { CORE_MODULES } from '~/plugins/constants/core-plugins.constants';
import { pluginsConfigState } from 'ui-modules';
import { useAtomValue } from 'jotai';
import { SETTINGS_PATH_DATA } from '../constants/data';

import { usePageTrackerStore } from 'react-page-tracker';

export function SettingsSidebar() {
  const pluginsMetaData = useAtomValue(pluginsConfigState) || {};
  const pluginSettingsNavigations = Object.values(pluginsMetaData).map(
    (plugin) => plugin.settingsNavigation,
  );

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
            <NavigationMenuLinkItem
              pathPrefix={AppPath.Settings}
              path={item.path}
              name={item.name}
              key={item.name}
            />
          ))}
        </SettingsNavigationGroup>

        <SettingsNavigationGroup name="Core modules">
          {CORE_MODULES.filter((item) => item.hasSettings).map((item) => (
            <NavigationMenuLinkItem
              key={item.name}
              pathPrefix={AppPath.Settings}
              path={item.path}
              name={item.name}
            />
          ))}
        </SettingsNavigationGroup>

        {pluginSettingsNavigations.map(
          (SettingsNavigation, index) =>
            SettingsNavigation && <SettingsNavigation key={index} />,
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
