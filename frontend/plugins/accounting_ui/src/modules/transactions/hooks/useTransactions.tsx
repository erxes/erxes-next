import { TRANSACTIONS_QUERY } from '../graphql/transactionQueries';
import { OperationVariables, useQuery } from '@apollo/client';

export const useTransactions = (options?: OperationVariables) => {
  const { data, loading, error, fetchMore } = useQuery(
    TRANSACTIONS_QUERY,
    options,
  );

  const handleFetchMore = () => {
    fetchMore({
      variables: {
        ...options,
      },
    });
  };

  return {
    transactions: data?.accTransactions,
    totalCount: data?.accTransactionsCount,
    loading,
    error,
    handleFetchMore,
  };
};
