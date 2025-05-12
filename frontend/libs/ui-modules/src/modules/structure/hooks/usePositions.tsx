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

  const positions = data ? data.positions : [];

  return {
    positions,
    loading,
    error,
    handleFetchMore,
  };
};
