import { QueryHookOptions, useQuery } from '@apollo/client';

import { useContactFilterValues } from '@/contacts/contacts-filter/hooks/useContactFilterValues';
import { GET_CUSTOMERS } from '@/contacts/graphql/queries/getCustomers';
import { ICustomer } from '../types/customerType';
import { useEffect, useState } from 'react';
import { useQueryState } from 'erxes-ui';

export const CUSTOMERS_PER_PAGE = 24;

export const useCustomers = (options?: QueryHookOptions) => {
  const { variables } = useContactFilterValues();
  const [cursor, setCursor] = useQueryState<string | undefined>('cursor');
  const [defaultCursor, setDefaultCursor] = useState<string | undefined>(
    cursor || undefined,
  );
  const [sessionCursor] = useState<string | undefined>(
    sessionStorage.getItem('contacts_cursor') || undefined,
  );

  const { data, loading, fetchMore } = useQuery<{
    customers: {
      list: ICustomer[];
      pageInfo: {
        endCursor: string;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor: string;
      };
    };
  }>(GET_CUSTOMERS, {
    ...options,
    variables: {
      limit: CUSTOMERS_PER_PAGE,
      cursor: defaultCursor ? sessionCursor || defaultCursor : sessionCursor,
      ...variables,
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

          const { endCursor, hasNextPage, hasPreviousPage, startCursor } =
            fetchMoreResult.customers.pageInfo;

          setCursor(prev.customers?.pageInfo?.endCursor);

          return Object.assign({}, prev, {
            customers: {
              pageInfo: {
                endCursor:
                  direction === 'forward'
                    ? endCursor
                    : prev.customers?.pageInfo?.endCursor,
                hasNextPage:
                  direction === 'forward'
                    ? hasNextPage
                    : prev.customers?.pageInfo?.hasNextPage,
                hasPreviousPage:
                  direction === 'forward'
                    ? prev.customers?.pageInfo?.hasPreviousPage
                    : hasPreviousPage,
                startCursor:
                  direction === 'forward'
                    ? prev.customers?.pageInfo?.startCursor
                    : startCursor,
              },
              list:
                direction === 'forward'
                  ? [
                      ...(prev.customers?.list || []),
                      ...(fetchMoreResult.customers?.list || []),
                    ]
                  : [
                      ...(fetchMoreResult.customers?.list || []),
                      ...(prev.customers?.list || []),
                    ],
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
