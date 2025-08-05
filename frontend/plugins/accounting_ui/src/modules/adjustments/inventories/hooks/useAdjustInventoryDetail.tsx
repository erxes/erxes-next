import { useQuery, OperationVariables } from '@apollo/client';
import { ADJUST_INVENTORY_DETAIL_QUERY } from '../graphql/adjustInventoryQueries';
import { IAdjustInventory } from '../types/AdjustInventory';

export const useAdjustInventoryDetail = (options?: OperationVariables) => {
  const { data, loading, error } = useQuery<
    { adjustInventoryDetail: IAdjustInventory },
    OperationVariables
  >(ADJUST_INVENTORY_DETAIL_QUERY, {
    ...options,
  });

  const adjustInventory = data?.adjustInventoryDetail;

  return {
    adjustInventory,
    loading,
    error,
  };
};
