import { useIsFavorite } from './useIsFavorite';
import { useMutation } from '@apollo/client';
import { TOGGLE_FAVORITE } from '../graphql/mutations/toggleFavorite';
import { useLocation } from 'react-router-dom';

export const useToggleFavorite = () => {
  const { pathname } = useLocation();

  const { isFavorite, refetch } = useIsFavorite({ path: pathname });
  const [toggleFavoriteMutation] = useMutation(TOGGLE_FAVORITE);

  const toggleFavorite = () => {
    toggleFavoriteMutation({
      variables: { type: 'module', path: pathname },
    }).then(() => {
      refetch();
    });
  };

  return { isFavorite, toggleFavorite };
};
