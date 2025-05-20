import { QueryHookOptions, useQuery } from '@apollo/client';
import { GET_UNITS_MAIN } from '../graphql/queries/getUnits';
import { IUnit } from '../types/Unit';

export const useUnits = (
  options?: QueryHookOptions<{
    units: IUnit[];
  }>,
) => {
  const { data, loading, error } = useQuery<{
    units: IUnit[];
  }>(GET_UNITS_MAIN, options);

  const units = data?.units || [];
  return {
    units,
    loading,
    error,
  };
};
