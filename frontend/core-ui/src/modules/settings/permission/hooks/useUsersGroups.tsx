import { useQuery } from '@apollo/client';
import { queries } from '../graphql';

const useUsersGroups = () => {
  const { data, loading, error } = useQuery(queries.getUsersGroupsQuery, {
    onError(error) {
      console.error('An error occoured on fetch', error.message);
    },
  });
  const usersGroups = data?.usersGroups || [];
  return {
    usersGroups,
    loading,
    error,
  };
};

export { useUsersGroups };
