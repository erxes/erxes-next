import { useQuery, OperationVariables } from '@apollo/client';
import { TRANSACTION_DETAIL_QUERY } from '../graphql/queries/accTransactionDetail';
import { ITransaction } from '../../types/Transaction';

export const useTransactionDetail = (options?: OperationVariables) => {
  const { data, loading, error } = useQuery<
    { accTransactionDetail: ITransaction },
    OperationVariables
  >(TRANSACTION_DETAIL_QUERY, {
    ...options,
  });

  return {
    transaction: data?.accTransactionDetail,
    loading,
    error,
  };
};
