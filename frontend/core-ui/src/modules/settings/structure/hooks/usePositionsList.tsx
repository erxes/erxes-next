import { OperationVariables, useQuery } from '@apollo/client';
import { GET_POSITIONS_LIST } from '../graphql';

export const usePositionsList = (options?: OperationVariables) => {
  const { data, loading, error } = useQuery(GET_POSITIONS_LIST, options);
  return {
    positions: data ? data.positionsMain.list : [],
    totalCount: data ? data.positionsMain.totalCount : 0,
    loading,
    error,
  };
};
