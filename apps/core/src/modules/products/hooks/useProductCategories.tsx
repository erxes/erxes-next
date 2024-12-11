import { QueryHookOptions, useQuery } from '@apollo/client';
import { productsQueries } from '@/products/graphql';

export const useProductCategories = (options: QueryHookOptions) => {
  const { data, loading } = useQuery(
    productsQueries.productCategories,
    options
  );

  return {
    productCategories: data?.productCategories,
    loading,
  };
};
