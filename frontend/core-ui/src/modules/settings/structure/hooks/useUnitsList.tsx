import { OperationVariables, useQuery } from '@apollo/client';
import { GET_UNITS_LIST } from '../graphql';

export const useUnitsList = (options?: OperationVariables) => {
  const { data, error, loading } = useQuery(GET_UNITS_LIST, options);

  return {
    units: data ? data?.unitsMain?.list : [],
    totalCount: data ? data?.unitsMain?.totalCount : 0,
    error,
    loading,
  };
};
