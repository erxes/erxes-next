import { useQuery, OperationVariables } from '@apollo/client';
import { TRANSACTION_DETAIL_QUERY } from '../graphql/queries/accTransactionDetail';
import { ITransaction } from '../../types/Transaction';

export const useTransactionDetail = (options?: OperationVariables) => {
  const { data, loading, error } = useQuery<
    { accTransactionDetail: ITransaction[] },
    OperationVariables
  >(TRANSACTION_DETAIL_QUERY, {
    ...options,
  });

  const transactions = data?.accTransactionDetail;
  return {
    transactions,
    activeTrs: transactions?.filter(tr => !tr.originId),
    // trDoc:
    loading,
    error,
  };
};
