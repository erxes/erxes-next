import { useQuery } from '@apollo/client';
import { QueryHookOptions } from '@apollo/client';

import { uomQuery } from '@/products/graphql/UomQuery';

export const useUom = (options: QueryHookOptions) => {
  const { data, loading } = useQuery(uomQuery, options);
  return {
    uoms: data?.uoms || [],
    loading
  };
};
