import { QueryHookOptions, useQuery } from '@apollo/client';
import { GET_CUSTOMERS } from '@/contacts/graphql/queries/getCustomers';
import { useContactFilterValues } from '@/contacts/contacts-filter/hooks/useContactFilterValues';

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

  const { list: customers, totalCount } = data?.customersMain || {};

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
          customersMain: {
            ...prev.customersMain,
            list: [
              ...(prev.customersMain?.list || []),
              ...(fetchMoreResult.customersMain?.list || []),
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
