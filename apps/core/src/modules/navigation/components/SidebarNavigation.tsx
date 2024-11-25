import { Sidebar, Collapsible } from 'erxes-ui';

import { ChevronRight, LucideIcon } from 'lucide-react';
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

// title: string;
//     url: string;
//     icon?: LucideIcon;
//     isActive?: boolean;
//     items?: {
//       title: string;
//       url: string;
//     }[];

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
              {/* {item.items ? (
              <Collapsible.Root
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <Sidebar.MenuItem>
                  <Collapsible.Trigger asChild>
                    <Sidebar.MenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{t('nav.' + item.title)}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </Sidebar.MenuButton>
                  </Collapsible.Trigger>
                  <Collapsible.Content>
                    <Sidebar.MenuSub>
                      {item.items?.map((subItem) => (
                        <Sidebar.MenuSubItem key={subItem.title}>
                          <Sidebar.MenuSubButton asChild>
                            <Link to={subItem.url}>
                              <span>{t('nav.' + subItem.title)}</span>
                            </Link>
                          </Sidebar.MenuSubButton>
                        </Sidebar.MenuSubItem>
                      ))}
                    </Sidebar.MenuSub>
                  </Collapsible.Content>
                </Sidebar.MenuItem>
              </Collapsible.Root>
            ) : ( */}
              <Sidebar.MenuItem key={item.handle}>
                <Sidebar.MenuButton asChild>
                  <Link to={item.handle}>
                    {Icon && <Icon />}
                    <span>{t('nav.' + PLUGINS[item.handle].title)}</span>
                  </Link>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
              {/* )} */}
            </React.Fragment>
          );
        })}
      </Sidebar.Menu>
    </Sidebar.Group>
  );
}
