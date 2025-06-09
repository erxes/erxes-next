import { OperationVariables, useMutation } from '@apollo/client';
import { ACC_TRANSACTIONS_CREATE } from '../graphql/mutations/accTransactionsCreate';
import { TAddTransactionGroup } from '../types/JournalForms';
import { toast } from 'erxes-ui/hooks';
import { useNavigate } from 'react-router-dom';


export const useTransactionsCreate = (options?: OperationVariables) => {
  const navigate = useNavigate();

  const [_createTransaction, { loading }] = useMutation(
    ACC_TRANSACTIONS_CREATE,
    options,
  );

  const createTransaction = (data: TAddTransactionGroup) => {
    const trDocs = data.trDocs.map(trD => ({
      ...trD,
      details: trD.details.map(det => ({
        ...det,
        account: undefined,
      })),
      date: data.date,
      number: data.number,
    }));

    return _createTransaction({
      ...options,
      variables: { trDocs },
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
          description: 'Transactions created successfully',
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
    createTransaction,
    loading,
  };
};
