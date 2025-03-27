import { OperationVariables, useQuery } from '@apollo/client';
import { GET_UNIT_BT_ID } from '../graphql/queries/getUnits';

export const useUnitById = (options: OperationVariables) => {
  const { data, loading } = useQuery(GET_UNIT_BT_ID, {
    skip: !options.variables?.id,
    ...options,
  });
  const { unitDetail } = data || {};
  return { unitDetail, loading };
};
