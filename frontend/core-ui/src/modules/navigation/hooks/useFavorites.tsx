import { useQuery } from '@apollo/client';
import { GET_FAVORITES } from '@/navigation/graphql/queries/getFavorites';
import { currentUserState } from 'ui-modules';
import { useAtomValue } from 'jotai';
import { usePluginsModules } from '@/navigation/hooks/usePLuginsModules';

interface Favorite {
  _id: string;
  type: 'module' | 'submenu';
  item: string;
}

interface FavoriteModule {
  name: string;
  icon: React.ElementType;
  path: string;
}

interface GetFavoritesResponse {
  getFavoritesByCurrentUser: Favorite[];
}

export function useFavorites(): FavoriteModule[] {
  const modules = usePluginsModules();

  const { data } = useQuery<GetFavoritesResponse>(GET_FAVORITES);

  const favorites = data?.getFavoritesByCurrentUser ?? [];

  return favorites.reduce<FavoriteModule[]>((acc, favorite) => {
    console.log(modules, favorites);
    if (favorite.type === 'module') {
      const module = modules.find((m) => m.name === favorite.item);
      console.log(module);
      if (module) {
        acc.push({
          name: module.name,
          icon: module.icon,
          path: module.path,
        });
      }
    }

    if (favorite.type === 'submenu') {
      const moduleWithSubmenu = modules.find((module) => {
        return module.submenus?.some(
          (sub) => sub.name.toLowerCase() === favorite.item.toLowerCase(),
        );
      });

      if (moduleWithSubmenu?.submenus) {
        const matchingSubmenu = moduleWithSubmenu.submenus.find(
          (sub) => sub.name.toLowerCase() === favorite.item.toLowerCase(),
        );

        if (matchingSubmenu) {
          acc.push({
            name: matchingSubmenu.name,
            icon: matchingSubmenu.icon || moduleWithSubmenu.icon,
            path: matchingSubmenu.path,
          });
        }
      }
    }

    return acc;
  }, []);
}
