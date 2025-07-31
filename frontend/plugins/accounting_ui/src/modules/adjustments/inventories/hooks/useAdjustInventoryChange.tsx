import { OperationVariables, useMutation } from '@apollo/client';
import { ADJUST_INVENTORY_PUBLISH, ADJUST_INVENTORY_CANCEL, ADJUST_INVENTORY_RUN } from '../graphql/adjustInventoryChange';
import { toast } from 'erxes-ui';
import { ADJUST_INVENTORY_DETAIL_QUERY, ADJUST_INVENTORY_DETAILS_QUERY } from '../graphql/adjustInventoryQueries';

export const useAdjustInventoryChange = (options?: OperationVariables) => {
  const [_updateTransaction, { loading }] = useMutation(
    ADJUST_INVENTORY_PUBLISH,
    options,
  );

  const updateTransaction = (options: OperationVariables) => {

    return _updateTransaction({
      ...options,
      onError: (error: Error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
        options?.onError?.(error);
      },
      onCompleted: (data) => {
        toast({
          title: 'Success',
          description: 'Transactions updated successfully',
        });
        options?.onCompleted?.(data)
      },
      refetchQueries: [
        {
          query: TRANSACTIONS_QUERY,
          variables: {
            "page": 1,
            "perPage": 20
          }
        },
        {
          query: TR_RECORDS_QUERY,
        },
        TRANSACTION_DETAIL_QUERY
      ],
      awaitRefetchQueries: true,
    });

  };

  return {
    updateTransaction,
    loading,
  };
};
