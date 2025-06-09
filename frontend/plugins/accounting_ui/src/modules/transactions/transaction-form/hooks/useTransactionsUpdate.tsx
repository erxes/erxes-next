import { OperationVariables, useMutation } from '@apollo/client';
import { ACC_TRANSACTIONS_UPDATE } from '../graphql/mutations/accTransactionsUpdate';
import { TAddTransactionGroup } from '../types/JournalForms';
import { toast } from 'erxes-ui/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const useTransactionsUpdate = (options?: OperationVariables) => {
  const navigate = useNavigate();
  const [_updateTransaction, { loading }] = useMutation(
    ACC_TRANSACTIONS_UPDATE,
    options,
  );

  const updateTransaction = (data: TAddTransactionGroup) => {
    const trDocs = data.trDocs.map(trD => ({
      ...trD,
      details: trD.details.map(det => ({
        ...det,
        account: undefined,
      })),
      date: data.date,
      number: data.number,
    }));

    return _updateTransaction({
      ...options,
      variables: { parentId: data.parentId, trDocs },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
        options?.onError?.(error);
      },
      onCompleted: () => {
        toast({
          title: 'Success',
          description: 'Transactions updated successfully',
        });
      },
      update: (_cache, { data }) => {
        const newParentId = data?.accTransactionsCreate[0]?.parentId;

        const pathname = newParentId
          ? `/accounting/transaction/edit?parentId=${newParentId}`
          : "/accounting/main";

        navigate(pathname);
      },
    });

  };

  return {
    updateTransaction,
    loading,
  };
};
