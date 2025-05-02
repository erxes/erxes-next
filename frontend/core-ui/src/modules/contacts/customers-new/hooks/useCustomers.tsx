import { QueryHookOptions, useQuery } from '@apollo/client';

import { GET_CUSTOMERS } from '@/contacts/customers-new/graphql/queries/getCustomers';
import { ICustomer } from '@/contacts/types/customerType';
import {
  IRecordTableCursorPageInfo,
  useRecordTableCursor,
  mergeCursorData,
  validateFetchMore,
  EnumCursorDirection,
  useMultiQueryState,
} from 'erxes-ui';
import { useSetAtom } from 'jotai';
import { customersCountState } from '@/contacts/states/customersCountState';

const CUSTOMERS_PER_PAGE = 20;

export const useCustomers = (options?: QueryHookOptions) => {
  const setCustomersCount = useSetAtom(customersCountState);

  const [queries] = useMultiQueryState<{
    searchValue: string;
    tags: string[];
  }>(['searchValue', 'tags']);

  const { cursor } = useRecordTableCursor({
    sessionKey: 'customers_cursor',
  });

  const { data, loading, fetchMore } = useQuery<{
    customers: {
      list: ICustomer[];
      pageInfo: IRecordTableCursorPageInfo;
      totalCount: number;
    };
  }>(GET_CUSTOMERS, {
    ...options,
    variables: {
      limit: CUSTOMERS_PER_PAGE,
      cursor,
      ...queries,
      ...options?.variables,
    },
    onCompleted(data) {
      setCustomersCount(data?.customers?.list?.length);
      options?.onCompleted?.(data);
    },
  });

  const { list: customers, pageInfo, totalCount } = data?.customers || {};

  const handleFetchMore = ({
    direction,
  }: {
    direction: EnumCursorDirection;
  }) => {
    if (!validateFetchMore({ direction, pageInfo })) return;

    fetchMore({
      variables: {
        ...queries,
        cursor:
          direction === EnumCursorDirection.FORWARD
            ? pageInfo?.endCursor
            : pageInfo?.startCursor,
        limit: CUSTOMERS_PER_PAGE,
        direction,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
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
    totalCount,
  };
};
