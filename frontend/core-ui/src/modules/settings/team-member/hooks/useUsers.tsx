import { OperationVariables, useQuery } from '@apollo/client';
import { queries } from '@/settings/team-member/graphql';
import { useMultiQueryState } from 'erxes-ui';

export const USERS_PER_PAGE = 30;

const useUsers = (options?: OperationVariables) => {
  const [{ branchId, departmentId, unitId }] = useMultiQueryState([
    'branchId',
    'departmentId',
    'unitId',
  ]);
  const { data, loading, error, fetchMore } = useQuery(
    queries.GET_USERS_QUERY,
    {
      ...options,
      variables: {
        branchId: branchId ?? undefined,
        departmentId: departmentId ?? undefined,
        unitId: unitId ?? undefined,
        perPage: USERS_PER_PAGE,
        ...options?.variables,
      },
      onError(error) {
        console.error('An error occoured on fetch', error.message);
      },
    },
  );

  const {
    list: users,
    usersTotalCount: totalCount,
    pageInfo,
  } = data?.users || {};
  console.log('users', users);

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
