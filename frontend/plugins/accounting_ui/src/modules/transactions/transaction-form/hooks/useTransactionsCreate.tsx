import { OperationVariables, useMutation } from '@apollo/client';
import { ACC_TRANSACTIONS_CREATE } from '../graphql/mutations/accTransactionsCreate';
import { TAddTransactionGroup } from '../types/AddTransaction';

export const useTransactionsCreate = (options?: OperationVariables) => {
  // ????????????????//
  const [_createTransaction, { loading }] = useMutation(
    ACC_TRANSACTIONS_CREATE,
    options,
  );

  const createTransaction = (data: TAddTransactionGroup) => {
    const doc = data.details.map(
      ({
        description,
        journal,
        branchId,
        departmentId,
        customerType,
        customerId,
        assignedUserIds,
      }) => ({
        number: data.number || 'auto/new',
        date: data.date,
        description,
        journal,
        branchId,
        departmentId,
        customerType,
        customerId,
        assignedUserIds,
      }),
    );
  };

  return {
    createTransaction,
    loading,
  };
};
