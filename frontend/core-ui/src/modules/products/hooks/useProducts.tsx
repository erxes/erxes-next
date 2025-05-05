import { QueryHookOptions, useQuery } from '@apollo/client';

import { productsQueries } from '@/products/graphql';
import {
  EnumCursorDirection,
  IRecordTableCursorPageInfo,
  mergeCursorData,
  useRecordTableCursor,
  validateFetchMore,
} from 'erxes-ui';
import { IProduct } from 'ui-modules';
const PRODUCTS_PER_PAGE = 30;

export const useProducts = (options?: QueryHookOptions) => {
  const { cursor } = useRecordTableCursor({
    sessionKey: 'products_cursor',
  });
  const { data, loading, fetchMore } = useQuery<{
    products: {
      list: IProduct[];
      totalCount: number;
      pageInfo: IRecordTableCursorPageInfo;
    };
  }>(productsQueries.products, {
    ...options,
    variables: {
      limit: PRODUCTS_PER_PAGE,
      cursor,
      ...options?.variables,
    },
  });

  const { list: products, totalCount, pageInfo } = data?.products || {};

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
          products: mergeCursorData({
            direction,
            fetchMoreResult: fetchMoreResult.products,
            prevResult: prev.products,
          }),
        });
      },
    });
  };

  return {
    loading,
    products,
    totalCount,
    handleFetchMore,
    pageInfo,
  };
};
