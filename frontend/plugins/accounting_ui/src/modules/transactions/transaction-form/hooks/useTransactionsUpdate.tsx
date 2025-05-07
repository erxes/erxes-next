import { OperationVariables, useMutation } from '@apollo/client';
import { ACC_TRANSACTIONS_UPDATE } from '../graphql/mutations/accTransactionsUpdate';
import { TAddTransactionGroup } from '../types/AddTransaction';

export const useTransactionsUpdate = (options?: OperationVariables) => {
  // ????????????????//
  const [_updateTransaction, { loading }] = useMutation(
    ACC_TRANSACTIONS_UPDATE,
    options,
  );

  const updateTransaction = (data: TAddTransactionGroup) => {
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
    updateTransaction,
    loading,
  };
};
