import { useQuery } from '@apollo/client';
import { productsQueries } from '@/products/graphql';
import { useSearchParams } from 'react-router-dom';

const PRODUCTS_PER_PAGE = 30;

export const useProducts = () => {
  const [searchParams] = useSearchParams();

  // Convert searchParams to plain object
  const searchParamsObject = Object.fromEntries(searchParams.entries());

  const { data, loading, fetchMore } = useQuery(productsQueries.products, {
    variables: {
      perPage: PRODUCTS_PER_PAGE,
      ...searchParamsObject,
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
