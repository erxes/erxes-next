import { OperationVariables, useQuery } from '@apollo/client';
import { GET_POSITIONS_QUERY } from '../graphql/queries/getPositions';

export const usePositions = (options?: OperationVariables) => {
  const { data, loading, error, fetchMore } = useQuery(
    GET_POSITIONS_QUERY,
    options,
  );

  const handleFetchMore = () => {
    fetchMore({
      variables: {
        ...options,
      },
    });
  };

  const positions = data ? data.positionsMain?.list : [];

  return {
    positions,
    totalCount: data ? data.positionsMain?.totalCount : 0,
    pageInfo: data ? data.positionsMain?.pageInfo : undefined,
    loading,
    error,
    handleFetchMore,
  };
};
