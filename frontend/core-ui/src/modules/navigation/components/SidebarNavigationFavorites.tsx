import { NavigationMenuGroup, NavigationMenuLinkItem } from 'erxes-ui';
import { useFavorites } from '../hooks/useFavorites';

export function SidebarNavigationFavorites() {
  const favorites = useFavorites();

  if (!favorites || favorites.length === 0) return null;

  return (
    <NavigationMenuGroup name="Favorites">
      {favorites.map((item) => {
        return <SidebarNavigationFavoritesItem key={item.name} {...item} />;
      })}
    </NavigationMenuGroup>
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
  const Icon = icon || (() => <span />);
  const pathWithoutUi = path.replace('_ui', '');

  return (
    <NavigationMenuLinkItem name={name} icon={Icon} path={pathWithoutUi} />
  );
}
