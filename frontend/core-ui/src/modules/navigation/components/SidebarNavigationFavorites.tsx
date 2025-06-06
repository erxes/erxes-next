import { Link, useLocation } from 'react-router-dom';
import { IconCaretUpFilled } from '@tabler/icons-react';
import { Collapsible, Sidebar, IUIConfig, cn } from 'erxes-ui';
import { NavigationButton } from './NavigationButton';
import { Icon } from '@tabler/icons-react';
import { useFavorites } from '../hooks/useFavorites';

export function SidebarNavigationFavorites() {
  const favorites = useFavorites();

  if (!favorites || favorites.length === 0) return null;

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <Sidebar.Group>
        <Sidebar.GroupLabel asChild>
          <Collapsible.Trigger className="flex items-center gap-2">
            <IconCaretUpFilled className="size-3.5 ml-1 transition-transform group-data-[state=open]/collapsible:rotate-180" />
            <span className="text-xs font-sans font-semibold normal-case">Favorites</span>
          </Collapsible.Trigger>
        </Sidebar.GroupLabel>
        <Collapsible.Content>
          <Sidebar.GroupContent className="pt-2">
            <Sidebar.Menu>
              {favorites.map((item) => {
                return (
                  <SidebarNavigationFavoritesItem key={item.name} {...item} />
                );
              })}
            </Sidebar.Menu>
          </Sidebar.GroupContent>
        </Collapsible.Content>
      </Sidebar.Group>
    </Collapsible>
  );
}

export function SidebarNavigationFavoritesItem({
  name,
  icon,
  path,
}: {
  name: string;
  icon?: React.ElementType;
  path: string;
}) {
  const pathname = useLocation().pathname;
  const Icon = icon || (() => <span />);
  const pathWithoutUi = path.replace('_ui', '');
  const isActive = pathname.includes(pathWithoutUi);

  return (
    <Collapsible asChild open={isActive} className="group/collapsible">
      <Sidebar.MenuItem key={name}>
        <NavigationButton
          isFavorite={true}
          pathname={pathWithoutUi}
          name={name}
          icon={Icon as Icon}
        />
      </Sidebar.MenuItem>
    </Collapsible>
  );
}
