import { QueryHookOptions, useQuery } from '@apollo/client';
import { productsQueries } from '@/products/graphql';
import {
  EnumCursorDirection,
  IRecordTableCursorPageInfo,
  mergeCursorData,
  parseDateRangeFromString,
  useMultiQueryState,
  useRecordTableCursor,
  validateFetchMore,
} from 'erxes-ui';
import { IProduct } from 'ui-modules';
import { PRODUCTS_CURSOR_SESSION_KEY } from '@/products/constants/productsCursorSessionKey';
export const PRODUCTS_PER_PAGE = 30;

export const useProducts = (options?: QueryHookOptions) => {
  const { cursor } = useRecordTableCursor({
    sessionKey: PRODUCTS_CURSOR_SESSION_KEY,
  });
  const [{ searchValue, tags, created, updated, lastSeen, brand }] =
    useMultiQueryState<{
      searchValue: string;
      tags: string[];
      created: string;
      updated: string;
      lastSeen: string;
      brand: string;
    }>(['searchValue', 'tags', 'created', 'updated', 'lastSeen', 'brand']);

  const productsQueryVariables = {
    limit: PRODUCTS_PER_PAGE,
    orderBy: {
      createdAt: -1,
    },
    cursor,
    searchValue,
    tagIds: tags?.length ? tags : undefined,
    brandIds: brand || undefined,
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
    ...options?.variables,
  };

  const { data, loading, fetchMore } = useQuery<{
    productsMain: {
      list: IProduct[];
      totalCount: number;
      pageInfo: IRecordTableCursorPageInfo;
    };
  }>(productsQueries.productsMain, {
    variables: productsQueryVariables,
    skip: cursor === undefined,
    ...options,
  });

  const { list: productsMain, totalCount, pageInfo } = data?.productsMain || {};

  const handleFetchMore = ({
    direction,
  }: {
    direction: EnumCursorDirection;
  }) => {
    if (
      !validateFetchMore({
        direction,
        pageInfo,
      })
    ) {
      return;
    }

    fetchMore({
      variables: {
        cursor:
          direction === EnumCursorDirection.FORWARD
            ? pageInfo?.endCursor
            : pageInfo?.startCursor,
        limit: PRODUCTS_PER_PAGE,
        direction,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          productsMain: mergeCursorData({
            direction,
            fetchMoreResult: fetchMoreResult.productsMain,
            prevResult: prev.productsMain,
          }),
        });
      },
    });
  };

  return {
    loading,
    productsMain,
    totalCount,
    handleFetchMore,
    pageInfo,
    productsQueryVariables,
  };
};
