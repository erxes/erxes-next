import { QueryHookOptions, useQuery, } from '@apollo/client';
import { GET_CUSTOMERS } from '@/contacts/customers/graphql/queries/getCustomers';
import { ICustomer } from '@/contacts/types/customerType';
import {
  IRecordTableCursorPageInfo,
  useRecordTableCursor,
  mergeCursorData,
  validateFetchMore,
  EnumCursorDirection,
  useMultiQueryState,
  parseDateRangeFromString,
} from 'erxes-ui';
import { useLocation } from 'react-router-dom';
import { ContactsPath } from '@/types/paths/ContactsPath';
import { CUSTOMERS_CURSOR_SESSION_KEY } from '@/contacts/customers/constants/customersCursorSessionKey';

const CUSTOMERS_PER_PAGE = 30;

export const useCustomers = (options?: QueryHookOptions) => {
  const pathname = useLocation().pathname;
  const [{ searchValue, tags, created, updated, lastSeen }] =
    useMultiQueryState<{
      searchValue: string;
      tags: string[];
      created: string;
      updated: string;
      lastSeen: string;
    }>(['searchValue', 'tags', 'created', 'updated', 'lastSeen']);

  const { cursor } = useRecordTableCursor({
    sessionKey: CUSTOMERS_CURSOR_SESSION_KEY,
  });

  const customersQueryVariables = {
    limit: CUSTOMERS_PER_PAGE,
    cursor,
    searchValue,
    tagIds: tags,
    dateFilters: JSON.stringify({
      createdAt: {
        gte: parseDateRangeFromString(created)?.from,
        lte: parseDateRangeFromString(created)?.to,
      },
      updatedAt: {
        gte: parseDateRangeFromString(updated)?.from,
        lte: parseDateRangeFromString(updated)?.to,
      },
      lastSeenAt: {
        gte: parseDateRangeFromString(lastSeen)?.from,
        lte: parseDateRangeFromString(lastSeen)?.to,
      },
    }),
    type: pathname.includes(ContactsPath.Leads) ? 'lead' : 'customer',
    ...options?.variables,
  };

  const { data, loading, fetchMore } = useQuery<{
    customers: {
      list: ICustomer[];
      pageInfo: IRecordTableCursorPageInfo;
      totalCount: number;
    };
  }>(GET_CUSTOMERS, {
    ...options,
    variables: customersQueryVariables,
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
    customersQueryVariables,
  };
};
