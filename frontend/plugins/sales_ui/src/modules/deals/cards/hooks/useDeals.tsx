import {
  GET_DEALS,
  GET_DEAL_DETAIL,
} from '@/deals/graphql/queries/DealsQueries';
import { IDeal, IDealList } from '@/deals/types/deals';
import { QueryHookOptions, useQuery } from '@apollo/client';

import { useQueryState } from 'erxes-ui';

export const useDeals = (options?: QueryHookOptions<{ deals: IDealList }>) => {
  const { data, loading, error } = useQuery<{ deals: IDealList }>(GET_DEALS, {
    ...options,
    variables: {
      ...options?.variables,
    },
  });

  return { deals: data?.deals, loading, error };
};

export const useDealDetail = (
  options?: QueryHookOptions<{ dealDetail: IDeal }>,
) => {
  const [_id] = useQueryState('salesItemId');

  const { data, loading, error } = useQuery<{ dealDetail: IDeal }>(
    GET_DEAL_DETAIL,
    {
      ...options,
      variables: {
        ...options?.variables,
        _id,
      },
      skip: !_id,
    },
  );

  return { deal: data?.dealDetail, loading, error };
};
