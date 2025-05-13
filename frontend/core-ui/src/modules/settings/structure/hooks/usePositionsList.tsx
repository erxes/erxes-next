import { OperationVariables, useQuery } from '@apollo/client';
import { GET_POSITIONS_LIST } from '../graphql';

export const usePositionsList = (options?: OperationVariables) => {
  const { data, loading, error } = useQuery(GET_POSITIONS_LIST, options);
  return {
    positions: data ? data.positions : [],
    loading,
    error,
  };
};
