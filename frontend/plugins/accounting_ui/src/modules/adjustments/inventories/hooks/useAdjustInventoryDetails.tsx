import { useQuery, OperationVariables } from '@apollo/client';
import { ADJUST_INVENTORY_DETAILS_QUERY } from '../graphql/adjustInventoryQueries';
import { IAdjustInvDetail } from '../types/AdjustInventory';
import { ACC_TRS__PER_PAGE } from '@/transactions/types/constants';

export const useAdjustInventoryDetails = (options?: OperationVariables) => {
  const { data, loading, error } = useQuery<
    { adjustInvDetails: IAdjustInvDetail[], adjustInvDetailsCount: number },
    OperationVariables
  >(ADJUST_INVENTORY_DETAILS_QUERY, {
    ...options,
    variables: {
      ...options?.variables,
      page: 1,
      perPage: ACC_TRS__PER_PAGE,
    },
  });
  const { adjustInvDetails, adjustInvDetailsCount } = data || {};

  return {
    adjustInvDetails,
    adjustInvDetailsCount,
    loading,
    error,
  };
};
