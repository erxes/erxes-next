import { useQuery } from '@apollo/client';
import { POSTS_QUERY } from '../gql/queries/postlist';

export const usePostLists = () => {
  const { data, loading, error } = useQuery(POSTS_QUERY, {
    variables: {
      perPage: 20,
    },
  });
  return {
    data: data || [],
    loading,
    error,
  };
};
