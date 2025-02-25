import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { IconCaretUpFilled } from '@tabler/icons-react';
import { Collapsible, Sidebar } from 'erxes-ui/components';
import { CORE_PLUGINS } from '~/plugins/constants/core-plugins.constants';
import { pluginsConfigState } from 'ui-modules';
import { cn } from 'erxes-ui/lib';
import { PluginItem } from '@/navigation/types/MenuItemType';
import { useAtom } from 'jotai';

export function SidebarNavigation() {
  const { t } = useTranslation();
  const plugins:PluginItem[] = [...CORE_PLUGINS] as PluginItem[];
  const [pluginsMetaData] = useAtom(pluginsConfigState);

  if (pluginsMetaData) {
    Object.keys(pluginsMetaData).forEach((key) => {
      plugins.push({
        path: `/${key}`,
        name: pluginsMetaData[key].name,
        icon: pluginsMetaData[key].icon,
      });
    });
  }

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <Sidebar.Group>
        <Sidebar.GroupLabel asChild>
          <Collapsible.Trigger>
            {t('nav.' + 'plugins')}{' '}
            <IconCaretUpFilled className="size-3.5 ml-1 transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </Collapsible.Trigger>
        </Sidebar.GroupLabel>
        <Collapsible.Content>
          <Sidebar.GroupContent className="pt-2">
            <Sidebar.Menu>
              {plugins.map((item: PluginItem) => {
                return <SidebarNavigationItem key={item.name} {...item} />;
              })}
            </Sidebar.Menu>
          </Sidebar.GroupContent>
        </Collapsible.Content>
      </Sidebar.Group>
    </Collapsible>
  );
}

export function SidebarNavigationItem({
  name,
  icon,
  path,
  submenus,
}: PluginItem) {
  const { t } = useTranslation();
  const pathname = useLocation().pathname;
  const Icon = icon;
  const pathWithoutUi = path.replace('_ui', '');
  const isActive = pathname.includes(pathWithoutUi);

  return (
    <Collapsible asChild open={isActive} className="group/collapsible">
      <Sidebar.MenuItem key={name}>
        <Sidebar.MenuButton asChild isActive={isActive}>
          <Link to={pathWithoutUi}>
            <Icon
              className={cn(
                'text-accent-foreground',
                isActive && 'text-primary',
              )}
            />
            <span>{t('nav.' + name)}</span>
          </Link>
        </Sidebar.MenuButton>
        {submenus && submenus.length > 0 && (
          <Collapsible.Content asChild>
            <Sidebar.Sub>
              {submenus.map((submenu) => {
                return (
                  <Sidebar.SubItem key={submenu.name}>
                    <Sidebar.SubButton
                      asChild
                      isActive={pathname.includes(submenu.path)}
                      className="w-full"
                    >
                      <Link to={submenu.path}>
                        <span>{t('nav.contactsSub.' + submenu.name)}</span>
                      </Link>
                    </Sidebar.SubButton>
                  </Sidebar.SubItem>
                );
              })}
            </Sidebar.Sub>
          </Collapsible.Content>
        )}
      </Sidebar.MenuItem>
    </Collapsible>
  );
}
