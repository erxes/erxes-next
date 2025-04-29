import { QueryHookOptions, useQuery } from '@apollo/client';

import { GET_CUSTOMERS } from '@/contacts/customers/graphql/queries/getCustomers';
import { ICustomer } from '@/contacts/types/customerType';
import {
  IRecordTableCursorPageInfo,
  useRecordTableCursor,
  mergeCursorData,
  validateFetchMore,
  EnumCursorDirection,
} from 'erxes-ui';
import { CUSTOMERS_PER_PAGE } from '@/contacts/customers-new/constants/customersPerPage';

export const useCustomers = (options?: QueryHookOptions) => {
  const { cursor, setCursor } = useRecordTableCursor({
    sessionKey: 'customers_cursor',
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
      ...options?.variables,
    },
  });

  const { list: customers, pageInfo } = data?.customers || {};

  const handleFetchMore = ({
    direction,
  }: {
    direction: EnumCursorDirection;
  }) => {
    if (!validateFetchMore({ direction, pageInfo })) return;

    fetchMore({
      variables: {
        cursor:
          direction === EnumCursorDirection.FORWARD
            ? pageInfo?.endCursor
            : pageInfo?.startCursor,
        limit: CUSTOMERS_PER_PAGE,
        direction,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        setCursor(prev?.customers?.pageInfo?.endCursor);

        return Object.assign({}, prev, {
          customers: mergeCursorData({
            direction,
            fetchMoreResult: fetchMoreResult.customers,
            prevResult: prev.customers,
          }),
        });
      },
    });
  };

  return {
    loading,
    customers,
    handleFetchMore,
    pageInfo,
  };
};
