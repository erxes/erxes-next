import { QueryHookOptions, useQuery } from '@apollo/client';
import { GET_CUSTOMERS } from '../graphql/queries/getCustomers';
import { CUSTOMER_INLINE } from '../graphql/queries/customerDetailQueries';
import { ICustomer } from '../types';
import { EnumCursorDirection, ICursorListResponse } from 'erxes-ui';

const CUSTOMERS_LIMIT = 30;
export const useCustomers = (
  options?: QueryHookOptions<ICursorListResponse<ICustomer>>,
) => {
  const { data, loading, fetchMore, error } = useQuery<
    ICursorListResponse<ICustomer>
  >(GET_CUSTOMERS, {
    ...options,
    variables: {
      limit: CUSTOMERS_LIMIT,
      ...options?.variables,
    },
  });
  const { list = [], totalCount = 0, pageInfo } = data?.customers || {};

  const handleFetchMore = () => {
    if (totalCount <= list.length) return;
    fetchMore({
      variables: {
        ...options?.variables,
        cursor: pageInfo?.endCursor,
        direction: EnumCursorDirection.FORWARD,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          ...prev,
          customers: {
            ...prev.customers,
            list: [
              ...(prev.customers.list || []),
              ...fetchMoreResult.customers.list,
            ],
            totalCount: fetchMoreResult.customers.totalCount,
            pageInfo: fetchMoreResult.customers.pageInfo,
          },
        });
      },
    });
  };

  return {
    customers: list,
    loading,
    handleFetchMore,
    totalCount,
    error,
  };
};

export const useCustomerInline = (
  options?: QueryHookOptions<{ customerDetail: ICustomer }>,
) => {
  const { data, loading, error } = useQuery<{ customerDetail: ICustomer }>(
    CUSTOMER_INLINE,
    options,
  );
  const { customerDetail } = data || {};
  return { customer: customerDetail, loading, error };
};
