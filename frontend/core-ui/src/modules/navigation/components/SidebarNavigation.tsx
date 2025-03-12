import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { IconCaretUpFilled } from '@tabler/icons-react';
import { Collapsible, Sidebar } from 'erxes-ui/components';
import { CORE_PLUGINS } from '~/plugins/constants/core-plugins.constants';
import { pluginsConfigState } from 'ui-modules';
import { cn } from 'erxes-ui/lib';
import { PluginItem } from '@/navigation/types/MenuItemType';
import { useAtom } from 'jotai';
import { useMemo } from 'react';

export function SidebarNavigation() {
  const { t } = useTranslation();
  const [pluginsMetaData] = useAtom(pluginsConfigState);

  // Memoize plugins array to prevent unnecessary recalculations
  const plugins = useMemo(() => {
    const allPlugins = [...CORE_PLUGINS] as PluginItem[];

    if (pluginsMetaData) {
      Object.entries(pluginsMetaData).forEach(([key, data]) => {
        allPlugins.push({
          path: `/${key}`,
          name: data.name,
          icon: data.icon,
        });
      });
    }

    return allPlugins;
  }, [pluginsMetaData]);

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
