import { QueryHookOptions, useQuery } from '@apollo/client';

import { GET_CUSTOMERS } from '@/contacts/customers/graphql/queries/getCustomers';
import { ICustomer } from '@/contacts/types/customerType';
import {
  IRecordTableCursorPageInfo,
  useRecordTableCursor,
  getCursorPageInfo,
} from 'erxes-ui';

export const CUSTOMERS_PER_PAGE = 24;

export const useCustomers = (options?: QueryHookOptions) => {
  const { cursor, setCursor } = useRecordTableCursor({
    sessionKey: 'contacts_cursor',
  });

  const { data, loading, fetchMore } = useQuery<{
    customers: {
      list: ICustomer[];
      pageInfo: IRecordTableCursorPageInfo;
    };
  }>(GET_CUSTOMERS, {
    ...options,
    variables: {
      limit: CUSTOMERS_PER_PAGE,
      cursor,
    },
  });

  const { list: customers, pageInfo } = data?.customers || {};

  const handleFetchMore = ({
    direction,
  }: {
    direction: 'forward' | 'backward';
    onFetchMoreCompleted?: (fetchMoreResult: {
      customers: {
        list: ICustomer[];
      };
    }) => void;
  }) => {
    if (
      (direction === 'forward' && pageInfo?.hasNextPage) ||
      (direction === 'backward' && pageInfo?.hasPreviousPage)
    ) {
      return fetchMore({
        variables: {
          cursor:
            direction === 'forward'
              ? pageInfo?.endCursor
              : pageInfo?.startCursor,
          limit: CUSTOMERS_PER_PAGE,
          direction,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          const { pageInfo: fetchMorePageInfo, list: fetchMoreList = [] } =
            fetchMoreResult.customers;

          const { pageInfo: prevPageInfo, list: prevList = [] } =
            prev.customers || {};

          setCursor(prevPageInfo?.endCursor);

          return Object.assign({}, prev, {
            customers: {
              pageInfo: getCursorPageInfo({
                direction,
                fetchMorePageInfo,
                prevPageInfo,
              }),
              list:
                direction === 'forward'
                  ? [...prevList, ...fetchMoreList]
                  : [...fetchMoreList, ...prevList],
            },
          });
        },
      });
    }
  };

  return {
    loading,
    customers,
    handleFetchMore,
    pageInfo,
  };
};
