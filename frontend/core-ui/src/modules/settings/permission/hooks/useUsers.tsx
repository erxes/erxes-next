import { useQuery } from '@apollo/client';
import { queries } from '../graphql';

const useUsers = () => {
  const { data, loading, error } = useQuery(queries.getUsersQuery, {
    onError(error) {
      console.error('An error occoured on fetch', error.message);
    },
  });
  const users = data?.users || [];
  return {
    loading,
    users,
    error,
  };
};

export { useUsers };
