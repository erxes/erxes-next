import { OperationVariables, useQuery } from '@apollo/client';
import { CTAX_ROWS } from '../graphql/queries/getCTaxs';

export const PER_PAGE = 20;

export const useCTaxRows = (options?: OperationVariables) => {
  const { data, loading, fetchMore } = useQuery(CTAX_ROWS, {
    ...options,
    variables: {
      page: 1,
      perPage: PER_PAGE,
      ...options?.variables,
    },
  });
  const { ctaxRows, ctaxRowsCount } = data || {};

  const handleFetchMore = () => {
    fetchMore({
      variables: {
        page: Math.ceil(ctaxRows?.length / PER_PAGE) + 1,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        return {
          ...prev,
          ctaxRows: [...prev.ctaxRows, ...fetchMoreResult.ctaxRows],
        };
      },
    });
  };

  return {
    ctaxRows,
    totalCount: ctaxRowsCount,
    loading,
    handleFetchMore,
  };
};
