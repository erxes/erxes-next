import { OperationVariables, useQuery } from '@apollo/client';
import { IUnitsMain } from '../types/Unit';
import { GET_UNITS_MAIN } from '../graphql/queries/getUnits';

export const useUnits = (options?: OperationVariables) => {
  const { data, loading, error } = useQuery<{
    units: IUnitsMain[];
  }>(GET_UNITS_MAIN, options);

  const units = data?.units || [];
  return {
    units,
    loading,
    error,
  };
};
