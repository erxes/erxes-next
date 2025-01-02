import { useQuery } from '@apollo/client';
import { uomQuery } from '@/products/graphql/UomQuery';
import { QueryHookOptions } from '@apollo/client';

export const useUom = (options: QueryHookOptions) => {
  const { data, loading } = useQuery(uomQuery, options);
  return {
    uoms: data?.brands,
    loading
  };
};
