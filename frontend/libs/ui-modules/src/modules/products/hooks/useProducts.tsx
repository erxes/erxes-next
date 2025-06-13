import { OperationVariables, useQuery } from '@apollo/client';
import {
  GET_ASSIGNED_PRODUCTS,
  GET_PRODUCTS,
} from '../graphql/queries/getProducts';
import { IProduct } from '../types/Product';
import { EnumCursorDirection } from 'erxes-ui';

const PRODUCTS_LIMIT = 30;
export const useProducts = (options?: OperationVariables) => {
  const { data, loading, fetchMore, error } = useQuery<{
    productsMain: {
      list: IProduct[];
      totalCount: number;
      pageInfo: { endCursor: string };
    };
  }>(GET_PRODUCTS, {
    ...options,
    variables: {
      limit: PRODUCTS_LIMIT,
      ...options?.variables,
    },
  });
  const { list = [], totalCount = 0, pageInfo } = data?.productsMain || {};

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
          productsMain: {
            list: [
              ...(prev.productsMain?.list || []),
              ...fetchMoreResult.productsMain.list,
            ],
            totalCount: fetchMoreResult.productsMain.totalCount,
            pageInfo: fetchMoreResult.productsMain.pageInfo,
          },
        });
      },
    });
  };
  return {
    products: list,
    loading,
    handleFetchMore,
    totalCount,
    error,
  };
};

interface IProductInlineData {
  productsMain: {list: IProduct[]};

}

export const useProductsInline = (options?: OperationVariables) => {
  const { data, loading, error } = useQuery<IProductInlineData>(
    GET_ASSIGNED_PRODUCTS,
    options,
  );
  return { products: data?.productsMain.list, loading, error };
};
