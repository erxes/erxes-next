import { OperationVariables, useQuery } from '@apollo/client';
import { GET_BRANCHES } from '../graphql/queries/getBranches';
import { IBranch } from '../types/Branch';
export const useBranches = (options?: OperationVariables) => {
  const { data, loading, fetchMore, error } = useQuery<{
    branches: IBranch[];
  }>(GET_BRANCHES, options);

  const handleFetchMore = () => {
    fetchMore({
      variables: {
        ...options,
      },
    });
  };

  return {
    branches: data?.branches,
    loading,
    error,
    handleFetchMore,
  };
};
