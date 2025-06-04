import { OperationVariables, useQuery } from '@apollo/client';
import { GET_USERS } from '@/teachers/graphql/queries/getUsers';

export const USERS_PER_PAGE = 30;

export const useUsers = (options?: OperationVariables) => {
  const { data, loading, error, fetchMore } = useQuery(GET_USERS, {
    ...options,
    variables: {
      perPage: USERS_PER_PAGE,
      ...options?.variables,
    },
  });

  const {
    list: users,
    usersTotalCount: totalCount,
    pageInfo,
  } = data?.users || {};

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
    pageInfo,
  };
};
