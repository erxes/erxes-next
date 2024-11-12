import { Sidebar, Collapsible } from 'erxes-ui';

import { ChevronRight, LucideIcon } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function SidebarNavigation({
  items,
  label,
}: {
  label: string;
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const { t } = useTranslation();
  return (
    <Sidebar.Group>
      <Sidebar.GroupLabel>{t('nav.' + label)}</Sidebar.GroupLabel>
      <Sidebar.Menu>
        {items.map((item) => (
          <React.Fragment key={item.title}>
            {item.items ? (
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
            ) : (
              <Sidebar.MenuItem key={item.title}>
                <Sidebar.MenuButton asChild>
                  <Link to={item.url}>
                    {item.icon && <item.icon />}
                    <span>{t('nav.' + item.title)}</span>
                  </Link>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            )}
          </React.Fragment>
        ))}
      </Sidebar.Menu>
    </Sidebar.Group>
  );
}
