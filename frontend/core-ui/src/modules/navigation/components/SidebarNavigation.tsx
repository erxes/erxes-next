import { Link, useLocation } from 'react-router-dom';
import { IconCaretUpFilled } from '@tabler/icons-react';
import { Collapsible, Sidebar, IUIConfig, cn } from 'erxes-ui';
import { CORE_MODULES } from '~/plugins/constants/core-plugins.constants';
import { pluginsConfigState } from 'ui-modules';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { NavigationButton } from './NavigationButton';
import { Icon } from '@tabler/icons-react';

export function SidebarNavigation() {
  const [pluginsMetaData] = useAtom(pluginsConfigState);

  const modules = useMemo(() => {
    const coreModules = [
      ...CORE_MODULES.filter((module) => module.hasSettings),
    ];

    if (pluginsMetaData) {
      const settingsModules = Object.values(pluginsMetaData || {}).flatMap(
        (plugin) =>
          plugin.modules.map((module) => ({
            ...module,
            pluginName: plugin.name,
          })),
      );

      return [...coreModules, ...settingsModules] as IUIConfig['modules'];
    }
    return coreModules;
  }, [pluginsMetaData]);

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <Sidebar.Group>
        <Sidebar.GroupLabel asChild>
          <Collapsible.Trigger>
            Modules
            <IconCaretUpFilled className="size-3.5 ml-1 transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </Collapsible.Trigger>
        </Sidebar.GroupLabel>
        <Collapsible.Content>
          <Sidebar.GroupContent className="pt-2">
            <Sidebar.Menu>
              {modules.map((item) => {
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
}: IUIConfig['modules'][number]) {
  const pathname = useLocation().pathname;
  const Icon = icon;
  const pathWithoutUi = path.replace('_ui', '');
  const isActive = pathname.includes(pathWithoutUi);

  return (
    <Collapsible asChild open={isActive} className="group/collapsible">
      <Sidebar.MenuItem key={name}>
        <NavigationButton
          pathname={pathWithoutUi}
          name={name}
          icon={Icon as Icon}
        />
        {submenus && submenus.length > 0 && (
          <Collapsible.Content asChild>
            <Sidebar.Sub>
              {submenus.map((submenu) => {
                const SubIcon = submenu.icon;
                const isSubmenuActive = pathname.includes(submenu.path);
                return (
                  <Sidebar.SubItem key={submenu.name}>
                    <Sidebar.SubButton
                      asChild
                      isActive={isSubmenuActive}
                      className="w-full"
                    >
                      <Link to={submenu.path}>
                        {SubIcon && (
                          <SubIcon
                            className={cn(
                              'text-accent-foreground',
                              isSubmenuActive && 'text-primary',
                            )}
                          />
                        )}
                        <span>{submenu.name}</span>
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
