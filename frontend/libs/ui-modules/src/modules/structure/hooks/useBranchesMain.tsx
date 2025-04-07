import { OperationVariables, useQuery } from '@apollo/client';
import { GET_BRANCHES_MAIN } from '../graphql/queries/getBranches';
import { IBranch } from '../types/Branch';
export const useBranchesMain = (options?: OperationVariables) => {
  const { data, loading, fetchMore, error } = useQuery<{
    branchesMain: {
      list: IBranch[];
      totalCount?: number;
      totalUsersCount?: number;
    };
  }>(GET_BRANCHES_MAIN, options);

  const handleFetchMore = () => {
    fetchMore({
      variables: {
        ...options,
      },
    });
  };

  return {
    branches: data?.branchesMain?.list,
    loading,
    error,
    handleFetchMore,
    totalCount: data?.branchesMain?.totalCount,
    totalUsersCount: data?.branchesMain?.totalUsersCount,
  };
};
