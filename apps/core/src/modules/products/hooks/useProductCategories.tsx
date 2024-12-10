import { useQuery } from '@apollo/client';
import { productsQueries } from '@/products/graphql';

export const useProductCategoies = () => {
  const { data, loading } = useQuery(productsQueries.productCategories);

  return {
    productCategories: data?.productCategories,
    loading,
  };
};
