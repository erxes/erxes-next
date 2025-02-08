import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';

import { IconCaretUpFilled } from '@tabler/icons-react';

import { Collapsible, Sidebar } from 'erxes-ui/components';
import { CORE_PLUGINS } from '~/plugins/constants/core-plugins.constants';
import { cn } from 'erxes-ui/lib';

export function SidebarNavigation() {
  const plugins = [...CORE_PLUGINS] as any;
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
        <Sidebar.GroupLabel asChild>
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
                const isActive = pathname.includes(item.path);
                return (
                  <React.Fragment key={item.name}>
                    <Sidebar.MenuItem key={item.name}>
                      <Sidebar.MenuButton asChild isActive={isActive}>
                        <Link to={item.path}>
                          <item.icon
                            className={cn(
                              'text-accent-foreground',
                              isActive && 'text-primary',
                            )}
                          />
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
