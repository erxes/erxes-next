import {
  ADD_DEALS,
  EDIT_DEALS,
  REMOVE_DEALS,
} from '@/deals/graphql/mutations/DealsMutations';
import {
  GET_DEALS,
  GET_DEAL_DETAIL,
} from '@/deals/graphql/queries/DealsQueries';
import { IDeal, IDealList } from '@/deals/types/deals';
import {
  MutationHookOptions,
  QueryHookOptions,
  useMutation,
  useQuery,
} from '@apollo/client';

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

export function useDealsEdit(options?: MutationHookOptions<any, any>) {
  const [_id] = useQueryState('salesItemId');

  const [editDeals, { loading, error }] = useMutation(EDIT_DEALS, {
    ...options,
    variables: {
      ...options?.variables,
      _id,
    },
    // refetchQueries: [
    //   {
    //     query: GET_CHECKLISTS,
    //     variables: {
    //       ...options?.variables,
    //       contentTypeId,
    //     },
    //   },
    // ],
    awaitRefetchQueries: true,
  });

  return {
    editDeals,
    loading,
    error,
  };
}

export function useDealsAdd(options?: MutationHookOptions<any, any>) {
  const [_id] = useQueryState('salesItemId');

  const [addDeals, { loading, error }] = useMutation(ADD_DEALS, {
    ...options,
    variables: {
      ...options?.variables,
      _id,
    },
    // refetchQueries: [
    //   {
    //     query: GET_CHECKLISTS,
    //     variables: {
    //       ...options?.variables,
    //       contentTypeId,
    //     },
    //   },
    // ],
    awaitRefetchQueries: true,
  });

  return {
    addDeals,
    loading,
    error,
  };
}

export function useDealsRemove(options?: MutationHookOptions<any, any>) {
  const [_id] = useQueryState('salesItemId');

  const [removeDeals, { loading, error }] = useMutation(REMOVE_DEALS, {
    ...options,
    variables: {
      ...options?.variables,
      _id,
    },
    // refetchQueries: [
    //   {
    //     query: GET_CHECKLISTS,
    //     variables: {
    //       ...options?.variables,
    //       contentTypeId,
    //     },
    //   },
    // ],
    awaitRefetchQueries: true,
  });

  return {
    removeDeals,
    loading,
    error,
  };
}
