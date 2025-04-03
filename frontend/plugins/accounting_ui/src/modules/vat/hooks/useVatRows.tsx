import { OperationVariables, useQuery } from '@apollo/client';
import { GET_VATS } from '../graphql/queries/getVats';
import {
  VAT_ROW_DEFAULT_VARIABLES,
  VAT_ROW_PER_PAGE,
} from '../constants/vatRowDefaultVariables';

export const useVatRows = (options?: OperationVariables) => {
  const { data, loading, fetchMore } = useQuery(GET_VATS, {
    ...options,
    variables: {
      ...VAT_ROW_DEFAULT_VARIABLES,
      ...options?.variables,
    },
  });
  const { vatRows, vatRowsCount } = data || {};

  const handleFetchMore = () => {
    fetchMore({
      variables: {
        page: Math.ceil(vatRows?.length / VAT_ROW_PER_PAGE) + 1,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        return {
          ...prev,
          vatRows: [...prev.vatRows, ...fetchMoreResult.vatRows],
        };
      },
    });
  };

  return {
    vatRows,
    totalCount: vatRowsCount,
    loading,
    handleFetchMore,
  };
};
