import { OperationVariables, useQuery } from '@apollo/client';
import { queries } from '@/settings/team-member/graphql';
import {
  EnumCursorDirection,
  mergeCursorData,
  useMultiQueryState,
  useRecordTableCursor,
  validateFetchMore,
} from 'erxes-ui';

export const USERS_PER_PAGE = 30;

const useUsers = (options?: OperationVariables) => {
  const { cursor } = useRecordTableCursor({
    sessionKey: 'users_cursor',
  });
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
        limit: USERS_PER_PAGE,
        cursor,
        ...options?.variables,
      },
      onError(error) {
        console.error('An error occoured on fetch', error.message);
      },
    },
  );

  const { list: users, totalCount, pageInfo } = data?.users || {};

  const handleFetchMore = ({
    direction,
  }: {
    direction: EnumCursorDirection;
  }) => {
    if (
      !validateFetchMore({
        direction,
        pageInfo,
      })
    ) {
      return;
    }

    fetchMore({
      variables: {
        cursor:
          direction === EnumCursorDirection.FORWARD
            ? pageInfo?.endCursor
            : pageInfo?.startCursor,
        limit: USERS_PER_PAGE,
        direction,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          users: mergeCursorData({
            direction,
            fetchMoreResult: fetchMoreResult.users,
            prevResult: prev.users,
          }),
        });
      },
    });
  };

  return {
    loading,
    users,
    error,
    totalCount,
    handleFetchMore,
    pageInfo,
  };
};

export { useUsers };
