import { useQuery, QueryHookOptions } from '@apollo/client';
import { categories } from '../graphql/queries';
import { IProductCategory } from '../types/category';

export interface CategoriesQueryResponse {
  productCategories: IProductCategory[];
}

export const useCategoriesWithSearch = (
  options?: QueryHookOptions<CategoriesQueryResponse>,
) => {
  const { data, loading, error } = useQuery<CategoriesQueryResponse>(
    categories.productCategories,
    {
      ...options,
    },
  );

  const productCategories = data?.productCategories || [];

  // Simple fetch more simulation since categories don't have cursor pagination
  const handleFetchMore = () => {
    // Categories typically don't need pagination as they're usually a smaller dataset
    // This is here for API compatibility with brands
  };

  return {
    categories: productCategories,
    loading,
    error,
    handleFetchMore,
    totalCount: productCategories.length,
  };
};
