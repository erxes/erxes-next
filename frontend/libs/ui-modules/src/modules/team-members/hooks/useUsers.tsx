import { useQuery, OperationVariables, QueryHookOptions } from '@apollo/client';
import { GET_ASSIGNED_MEMBER, GET_USERS } from '../graphql/queries/userQueries';
import { IMember } from '../types/TeamMembers';
import { EnumCursorDirection, ICursorListResponse } from 'erxes-ui';

const USERS_LIMIT = 30;

export const useUsers = (
  options?: QueryHookOptions<{ users: ICursorListResponse<IMember> }>,
) => {
  const { data, loading, fetchMore, error } = useQuery<{
    users: ICursorListResponse<IMember>;
  }>(GET_USERS, {
    ...options,
    variables: {
      limit: USERS_LIMIT,
      ...options?.variables,
    },
  });

  const { list = [], totalCount = 0, pageInfo } = data?.users || {};

  const handleFetchMore = () => {
    if (totalCount <= list.length) return;

    fetchMore({
      variables: {
        ...options?.variables,
        direction: EnumCursorDirection.FORWARD,
        cursor: pageInfo?.endCursor,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        return {
          ...prev,
          users: {
            ...prev.users,
            list: [...(prev.users.list || []), ...fetchMoreResult.users.list],
            totalCount: fetchMoreResult.users.totalCount,
            pageInfo: fetchMoreResult.users.pageInfo,
          },
        };
      },
    });
  };

  return {
    users: list,
    loading,
    handleFetchMore,
    error,
    totalCount,
  };
};

export const useAssignedMember = (options?: OperationVariables) => {
  const { data, loading, error } = useQuery(GET_ASSIGNED_MEMBER, options);
  return { details: data?.userDetail?.details, loading, error };
};

export interface IMemberInlineData {
  userDetail: IMember;
}

export const useMemberInline = (
  options?: QueryHookOptions<IMemberInlineData>,
) => {
  const { data, loading, error } = useQuery<IMemberInlineData>(
    GET_ASSIGNED_MEMBER,
    options,
  );
  const { userDetail } = data || {};
  return { userDetail, loading, error };
};
