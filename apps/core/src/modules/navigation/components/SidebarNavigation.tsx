import { Sidebar } from 'erxes-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { pluginsState, Plugin } from '../states/navigationStates';
import { PLUGINS } from '../constants/plugins';

export function SidebarNavigation() {
  const plugins = useRecoilValue(pluginsState);
  const pinnedPlugins = plugins.filter((plugin) => plugin.pinned);
  const unpinnedPlugins = plugins.filter((plugin) => !plugin.pinned);

  return (
    <>
      <SidebarNavigationItem items={pinnedPlugins} label="favorites" />
      <SidebarNavigationItem items={unpinnedPlugins} label="all" />
    </>
  );
}

export function SidebarNavigationItem({
  items,
  label,
}: {
  label: string;
  items: Plugin[];
}) {
  const { t } = useTranslation();
  return (
    <Sidebar.Group>
      <Sidebar.GroupLabel>{t('nav.' + label)}</Sidebar.GroupLabel>
      <Sidebar.Menu>
        {items.map((item) => {
          const Icon = PLUGINS[item.handle].icon;
          return (
            <React.Fragment key={item.handle}>
              <Sidebar.MenuItem key={item.handle}>
                <Sidebar.MenuButton asChild>
                  <Link to={item.handle}>
                    {Icon && <Icon />}
                    <span>{t('nav.' + PLUGINS[item.handle].title)}</span>
                  </Link>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            </React.Fragment>
          );
        })}
      </Sidebar.Menu>
    </Sidebar.Group>
  );
}
