import { useQuery, OperationVariables } from '@apollo/client';
import { GET_USERS_GROUP } from '../graphql/queries/userQueries';

export const useUsersGroup = (options?: OperationVariables) => {
  const USERS_GROUPS_PER_PAGE = 30;
  const { data, loading, fetchMore, error } = useQuery(GET_USERS_GROUP, {
    ...options,
    variables: {
      perPage: USERS_GROUPS_PER_PAGE,
      ...options?.variables,
    },
  });
  const usersGroups = data?.usersGroups?.list || [];
  const totalCount = data?.usersGroups?.TotalCount;

  const handleFetchMore = () => {
    if (totalCount <= usersGroups?.length) return;
    fetchMore({
      variables: {
        ...options?.variables,
        page: Math.ceil((usersGroups?.length || 1) / USERS_GROUPS_PER_PAGE) + 1,
        perPage: USERS_GROUPS_PER_PAGE,
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
    usersGroups,
    loading,
    error,
    handleFetchMore,
    totalCount,
  };
};
