import { Collapsible, Sidebar } from 'erxes-ui/components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import { useRecoilValue } from 'recoil';
import { pluginsState, Plugin } from '../states/navigationStates';
import { PLUGINS } from '../constants/plugins';
import { IconCaretUpFilled } from '@tabler/icons-react';

export function SidebarNavigation() {
  const plugins = useRecoilValue(pluginsState);
  const pinnedPlugins = plugins.filter((plugin) => plugin.pinned);

  return (
    <>
      <SidebarNavigationItem items={pinnedPlugins} label="plugins" />
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
  const pathname = useLocation().pathname;
  return (
    <Collapsible defaultOpen className="group/collapsible">
      <Sidebar.Group>
        <Sidebar.GroupLabel asChild className="hover:bg-zinc-200">
          <Collapsible.Trigger>
            {t('nav.' + label)}{' '}
            <IconCaretUpFilled className="size-3.5 ml-1 transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </Collapsible.Trigger>
        </Sidebar.GroupLabel>
        <Collapsible.Content>
          <Sidebar.GroupContent className="pt-2">
            <Sidebar.Menu>
              {items.map((item) => {
                const Icon = PLUGINS[item.handle].icon;
                return (
                  <React.Fragment key={item.handle}>
                    <Sidebar.MenuItem key={item.handle}>
                      <Sidebar.MenuButton
                        asChild
                        isActive={pathname.includes(item.handle)}
                      >
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
          </Sidebar.GroupContent>
        </Collapsible.Content>
      </Sidebar.Group>
    </Collapsible>
  );
}
