import { TR_RECORDS_QUERY } from '../graphql/transactionQueries';
import { OperationVariables, useQuery } from '@apollo/client';

export const useTrRecords = (options?: OperationVariables) => {
  const { data, loading, error, fetchMore } = useQuery(
    TR_RECORDS_QUERY,
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
    trRecords: data?.accTrRecords,
    totalCount: data?.accTrRecordsCount,
    loading,
    error,
    handleFetchMore,
  };
};
