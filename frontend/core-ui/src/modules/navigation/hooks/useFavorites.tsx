import { useQuery } from '@apollo/client';
import { GET_FAVORITES } from '@/navigation/graphql/queries/getFavorites';
import { useAtomValue } from 'jotai';
import { currentUserState } from 'ui-modules';

interface Favorite {
  _id: string;
  type: 'module' | 'submenu';
  path: string;
}

interface FavoriteModule {
  name: string;
  icon?: React.ElementType;
  path: string;
}

interface GetFavoritesResponse {
  getFavoritesByCurrentUser: Favorite[];
}

export function useFavorites(): FavoriteModule[] {
  const currentUser = useAtomValue(currentUserState);

  const { data } = useQuery<GetFavoritesResponse>(GET_FAVORITES, {
    skip: !currentUser || !currentUser?._id,
  });

  const favorites = data?.getFavoritesByCurrentUser ?? [];

  return [];
}
