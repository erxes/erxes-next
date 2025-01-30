import { useQuery, OperationVariables } from '@apollo/client';
import { GET_USERS } from '@/contacts/graphql/queries/getUsers';

export const useUsers = (options?: OperationVariables) => {
  const USERS_PER_PAGE = 30;
  const { data, loading, fetchMore, error } = useQuery(GET_USERS, {
    ...options,
    variables: {
      perPage: USERS_PER_PAGE,
      ...options?.variables,
    },
  });
  const users = data?.users || [];
  const totalCount = data?.usersTotalCount;

  const handleFetchMore = () => {
    if (totalCount <= users?.length) return;
    fetchMore({
      variables: {
        ...options?.variables,
        page: Math.ceil((users?.length || 1) / USERS_PER_PAGE) + 1,
        perPage: USERS_PER_PAGE,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          users: [...(prev.users || []), ...fetchMoreResult.users],
        });
      },
    });
  };

  return {
    users,
    loading,
    handleFetchMore,
    error,
    totalCount,
  };
};
