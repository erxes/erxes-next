import { OperationVariables, useQuery } from '@apollo/client';
import { GET_SELECT_PRODUCTS } from '../graphql/queries/getProducts';
import { IProduct } from 'ui-modules';

const PRODUCTS_PER_PAGE = 30;

export const useProducts = (options?: OperationVariables) => {
  const { data, loading, fetchMore, error } = useQuery<{
    products: IProduct[];
    productsTotalCount: number;
  }>(GET_SELECT_PRODUCTS, {
    variables: {
      perPage: PRODUCTS_PER_PAGE,
    },
  });

  const { products, productsTotalCount } = data || {};

  const handleFetchMore = () => {
    if (
      !products ||
      !productsTotalCount ||
      productsTotalCount <= products.length
    ) {
      return;
    }
    fetchMore({
      variables: {
        page: Math.ceil(products.length / PRODUCTS_PER_PAGE) + 1,
        perPage: PRODUCTS_PER_PAGE,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          products: [...(prev.products || []), ...fetchMoreResult.products],
        });
      },
    });
  };

  return {
    loading,
    products,
    totalCount: productsTotalCount,
    handleFetchMore,
    error,
  };
};
