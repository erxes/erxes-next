import { OperationVariables, useMutation } from '@apollo/client';
import { ACC_TRANSACTIONS_CREATE } from '../graphql/mutations/accTransactionsCreate';

export const useTransactionsCreate = (options?: OperationVariables) => {
  const [createTransaction, { loading }] = useMutation(
    ACC_TRANSACTIONS_CREATE,
    options,
  );

  return {
    createTransaction,
    loading,
  };
};
