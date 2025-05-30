import { OperationVariables, useQuery } from '@apollo/client';

import { categories } from '../graphql/queries';

export const useProductCategories = (options?: OperationVariables) => {
  const { data, loading, error } = useQuery(
    categories.productCategories,
    options
  );

  const { productCategories } = data || {};

  return {
    productCategories,
    loading,
    error,
  };
};
