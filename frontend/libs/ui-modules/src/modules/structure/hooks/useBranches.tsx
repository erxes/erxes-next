import { OperationVariables, useQuery } from '@apollo/client';
import {
  ASSIGNED_BRANCHES,
  GET_BRANCHES_MAIN,
} from '../graphql/queries/getBranches';
import { IBranch } from '../types/Branch';
import { EnumCursorDirection } from 'erxes-ui';

const BRANCHES_LIMIT = 30;
export const useBranches = (options?: OperationVariables) => {
  const { data, loading, fetchMore, error } = useQuery<{
    branchesMain: {
      list: IBranch[];
      totalCount?: number;
      totalUsersCount?: number;
      pageInfo: { endCursor: string };
    };
  }>(GET_BRANCHES_MAIN, {
    ...options,
    variables: {
      limit: BRANCHES_LIMIT,
      ...options?.variables,
    },
  });

  const { list = [], totalCount = 0, pageInfo } = data?.branchesMain || {};

  const handleFetchMore = () => {
    if (totalCount <= list.length) return;
    fetchMore({
      variables: {
        ...options?.variables,
        cursor: pageInfo?.endCursor,
        direction: EnumCursorDirection.FORWARD,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          branchesMain: {
            list: [
              ...(prev.branchesMain?.list || []),
              ...fetchMoreResult.branchesMain.list,
            ],
            totalCount: fetchMoreResult.branchesMain.totalCount,
            pageInfo: fetchMoreResult.branchesMain.pageInfo,
          },
        });
      },
    });
  };

  return {
    branches: list,
    loading,
    error,
    handleFetchMore,
    totalCount,
    totalUsersCount: data?.branchesMain?.totalUsersCount,
  };
};

interface IBranchInline {
  branchesMain: {
    list: IBranch[];
  };
}

export const useBranchesInline = (options?: OperationVariables) => {
  const { data, loading, error } = useQuery<IBranchInline>(
    ASSIGNED_BRANCHES,
    options,
  );
  return { branches: data?.branchesMain.list, loading, error };
};
