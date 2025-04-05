import { QueryHookOptions, useQuery } from '@apollo/client';

import { useContactFilterValues } from '@/contacts/contacts-filter/hooks/useContactFilterValues';
import { GET_CUSTOMERS } from '@/contacts/graphql/queries/getCustomers';

export const CUSTOMERS_PER_PAGE = 30;

export const useCustomers = (options?: QueryHookOptions) => {
  const { variables } = useContactFilterValues();
  const { data, loading, fetchMore } = useQuery(GET_CUSTOMERS, {
    ...options,
    variables: {
      perPage: CUSTOMERS_PER_PAGE,
      ...variables,
    },
  });

  const { customers, customerCounts: totalCount } = data || {};

  const handleFetchMore = () =>
    totalCount > customers?.length &&
    fetchMore({
      variables: {
        page: Math.ceil(customers.length / CUSTOMERS_PER_PAGE) + 1,
        perPage: CUSTOMERS_PER_PAGE,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          customers: {
            ...prev.customers,
            list: [
              ...(prev.customers?.list || []),
              ...(fetchMoreResult.customers?.list || []),
            ],
          },
        });
      },
    });
  return {
    loading,
    customers,
    totalCount,
    handleFetchMore,
  };
};
