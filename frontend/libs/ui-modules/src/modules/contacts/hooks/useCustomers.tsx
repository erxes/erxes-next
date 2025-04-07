import { OperationVariables, useQuery } from '@apollo/client';
import { GET_CUSTOMERS } from '../graphql/queries/getCustomers';

export const useCustomers = (options?: OperationVariables) => {
  const CUSTOMERS_PER_PAGE = 30;
  const { data, loading, fetchMore, error } = useQuery(GET_CUSTOMERS, {
    ...options,
    variables: {
      perPage: CUSTOMERS_PER_PAGE,
      ...options?.variables,
    },
  });
  const customers = data?.customersMain?.list;
  const totalCount = data?.customersMain?.totalCount;

  const handleFetchMore = () => {
    if (totalCount <= customers?.length) return;
    fetchMore({
      variables: {
        ...options?.variables,
        page: Math.ceil((customers?.length || 1) / CUSTOMERS_PER_PAGE) + 1,
        perPage: CUSTOMERS_PER_PAGE,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          customersMain: {
            list: [
              ...(prev.customersMain?.list || []),
              ...fetchMoreResult.customersMain.list,
            ],
            totalCount: fetchMoreResult.customersMain.totalCount,
          },
        });
      },
    });
  };

  return {
    customers,
    loading,
    handleFetchMore,
    totalCount,
    error,
  };
};
