import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';

import { IconCaretUpFilled } from '@tabler/icons-react';

import { Collapsible, Sidebar } from 'erxes-ui/components';
import { CORE_PLUGINS } from '~/plugins/constants/core-plugins.constants';
import { pluginsConfigState, PluginsConfig } from 'erxes-shared-states';

import { useRecoilValue } from 'recoil';

export function SidebarNavigation() {
  const plugins = [...CORE_PLUGINS] as any;

  // const pluginsMetaData =
  //   (useRecoilValue(pluginsConfigState) as PluginsConfig) || {};

  // Object.keys(pluginsMetaData).forEach((key) => {
  //   plugins.push({
  //     path: `/${key}`,
  //     name: pluginsMetaData[key].name,
  //     icon: pluginsMetaData[key].icon,
  //   });
  // });

  console.log(plugins);

  return (
    <>
      <SidebarNavigationItem items={plugins} label="plugins" />
    </>
  );
}

export function SidebarNavigationItem({
  items,
  label,
}: {
  label: string;
  items: any[];
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
                // const Icon = PLUGINS[item.handle].icon;
                return (
                  <React.Fragment key={item.name}>
                    <Sidebar.MenuItem key={item.name}>
                      <Sidebar.MenuButton
                        asChild
                        isActive={pathname.includes(item.path)}
                      >
                        <Link to={item.path}>
                          <item.icon />
                          <span>{t('nav.' + item.name)}</span>
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
