import { OperationVariables, useQuery } from '@apollo/client';
import { GET_BRANCHES } from '../graphql/queries/getBranches';

export const useBranches = (options?: OperationVariables) => {
  const { data, loading, fetchMore } = useQuery(GET_BRANCHES, options);

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
  };
};
