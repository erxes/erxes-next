import { QueryHookOptions, useQuery } from '@apollo/client';

import { GET_DEALS } from '@/deals/graphql/queries/DealsQueries';
import { IDeal } from '@/deals/types/deals';

export const useDeals = (options?: QueryHookOptions<{ deals: IDeal[] }>) => {
  const { data, loading, error } = useQuery<{ deals: IDeal[] }>(GET_DEALS, {
    ...options,
    variables: {
      ...options?.variables,
    },
  });

  return { deals: data?.deals, loading, error };
};
