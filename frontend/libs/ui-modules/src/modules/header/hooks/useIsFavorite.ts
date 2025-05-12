import { useQuery } from '@apollo/client';
import { IS_FAVORITE } from '../graphql/queries/isFavorite';

export const useIsFavorite = ({
  type,
  item,
}: {
  type: string;
  item: string;
}) => {
  const { data, refetch } = useQuery(IS_FAVORITE, {
    variables: { type, item },
  });

  return { isFavorite: data?.isFavorite, refetch };
};
