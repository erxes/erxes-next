import { OperationVariables, useQuery } from '@apollo/client';
import { queries } from '../graphql';

export const USERS_PER_PAGE = 20;

const useUsers = (options: OperationVariables) => {
  const { data, loading, error, fetchMore } = useQuery(
    queries.GET_USERS_QUERY,
    {
      ...options,
      variables: {
        perPage: USERS_PER_PAGE,
        ...options.variables,
      },
      onError(error) {
        console.error('An error occoured on fetch', error.message);
      },
    },
  );

  const { users, usersTotalCount: totalCount } = data || {};

  const handleFetchMore = () =>
    totalCount > users?.length &&
    fetchMore({
      variables: {
        page: Math.ceil(users.length / USERS_PER_PAGE) + 1,
        perPage: USERS_PER_PAGE,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          users: [...(prev.users || []), ...fetchMoreResult.users],
        });
      },
    });

  return {
    loading,
    users,
    error,
    totalCount,
    handleFetchMore,
  };
};

export { useUsers };
