import { useIsFavorite } from './useIsFavorite';
import { useMutation } from '@apollo/client';
import { TOGGLE_FAVORITE } from '../graphql/mutations/toggleFavorite';

export const useToggleFavorite = ({
  type,
  item,
}: {
  type: string;
  item: string;
}) => {
  const { isFavorite, refetch } = useIsFavorite({ type, item });
  const [toggleFavoriteMutation] = useMutation(TOGGLE_FAVORITE);

  console.log(isFavorite);

  const toggleFavorite = () => {
    toggleFavoriteMutation({ variables: { type, item } }).then(() => {
      refetch();
    });
  };

  return { isFavorite, toggleFavorite };
};
