import { useQuery } from '@apollo/client';
import { QueryHookOptions } from '@apollo/client';

import { brandsQuery } from '@/products/graphql/BrandsQuery';

export const useBrands = (options: QueryHookOptions) => {
  const { data, loading } = useQuery(brandsQuery, options);

  return {
    brands: data?.brands,
    loading,
  };
};
