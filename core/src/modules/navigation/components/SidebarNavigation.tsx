import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';

import { getInstance } from '@module-federation/enhanced/runtime';
import { IconCaretUpFilled } from '@tabler/icons-react';

import { Collapsible, Sidebar } from 'erxes-ui/components';
import { CORE_PLUGINS } from '~/plugins/constants/core-plugins.constants';

export function SidebarNavigation() {
  const instance = getInstance();

  const remotes = instance?.options.remotes || [];

  const plugins = [...remotes, ...CORE_PLUGINS];

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
                        isActive={pathname.includes(item.name)}
                      >
                        <Link to={item.name}>
                          {/* {Icon && <Icon />} */}
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
