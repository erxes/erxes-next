import { useQuery } from '@apollo/client';
import { productsQueries } from '@/products/graphql';
import { Filter } from 'erxes-ui/modules/filter/types/filter';

const PRODUCTS_PER_PAGE = 30;

export const useProducts = (filters: Filter[]) => {
  const { data, loading, fetchMore } = useQuery(productsQueries.products, {
    variables: {
      perPage: PRODUCTS_PER_PAGE,
    },
  });

  const { products, productsTotalCount } = data || {};

  const handleFetchMore = () =>
    productsTotalCount > products?.length &&
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

  return {
    loading,
    products,
    totalCount: productsTotalCount,
    handleFetchMore,
  };
};
