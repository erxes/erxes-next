import { ACC_TRANSACTIONS_REMOVE } from '../graphql/mutations/accTransactionsRemove';
import { OperationVariables, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { ACC_TRS__PER_PAGE } from '../../hooks/useTransactions';
import { TRANSACTIONS_QUERY } from '../../graphql/transactionQueries';
import { ITransaction } from '../../types/Transaction';

export const useTransactionsRemove = () => {
  const navigate = useNavigate();
  const [_removeTransactions, { loading }] = useMutation(ACC_TRANSACTIONS_REMOVE);

  const removeTransactions = (options: OperationVariables) => {
    return _removeTransactions({
      ...options,
      update: (cache) => {
        try {
          const queryVariables = { perPage: ACC_TRS__PER_PAGE, page: 1 };
          const existingData = cache.readQuery<{ accTransactions: ITransaction[] }>({
            query: TRANSACTIONS_QUERY,
            variables: queryVariables,
          });
          if (!existingData || !existingData.accTransactions) return;

          cache.writeQuery({
            query: TRANSACTIONS_QUERY,
            variables: queryVariables,
            data: {
              ...existingData,
              accTransactions: existingData.accTransactions.filter(
                (tr: ITransaction) =>
                  !options.variables.parentIds.includes(tr.parentId),
              ),
            },
          });
        } catch (error) {
          console.error(error);
        }

        const pathname = "/accounting/main";
        navigate(pathname);
      },
    });
  };

  return {
    removeTransactions,
    loading,
  };
};
