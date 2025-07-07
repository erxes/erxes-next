import { useQuery, OperationVariables } from '@apollo/client';
import { ADJUST_INVENTORY_DETAIL_QUERY } from '../graphql/adjustInventoryQueries';
import { IAdjustInventory } from '../types/AdjustInventory';

export const useAdjustInventoryDetail = (options?: OperationVariables) => {
  const { data, loading, error } = useQuery<
    { accTransactionDetail: IAdjustInventory[] },
    OperationVariables
  >(ADJUST_INVENTORY_DETAIL_QUERY, {
    ...options,
  });

  const adjustInventory = data?.accTransactionDetail;

  return {
    adjustInventory,
    loading,
    error,
  };
};
