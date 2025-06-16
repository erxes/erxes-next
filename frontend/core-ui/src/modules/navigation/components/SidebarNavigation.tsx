import { Link, useLocation } from 'react-router-dom';
import { IconCaretUpFilled } from '@tabler/icons-react';
import { Collapsible, Sidebar, IUIConfig, cn } from 'erxes-ui';
import { usePluginsModules } from '../hooks/usePluginsModules';
import { NavigationButton } from './NavigationButton';
import { Icon } from '@tabler/icons-react';

export function SidebarNavigation() {
  const modules = usePluginsModules();

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <Sidebar.Group>
        <Sidebar.GroupLabel asChild>
          <Collapsible.Trigger className="flex items-center gap-2">
            <IconCaretUpFilled className="size-3.5 transition-transform group-data-[state=open]/collapsible:rotate-180" />
            <span className="font-sans text-xs font-semibold normal-case">
              Modules
            </span>
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
  const { pathname } = useLocation();
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
                        <span className="capitalize">{submenu.name}</span>
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
