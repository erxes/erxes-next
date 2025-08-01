import {
  ADD_DEALS,
  EDIT_DEALS,
  REMOVE_DEALS,
} from '@/deals/graphql/mutations/DealsMutations';
import {
  EnumCursorDirection,
  mergeCursorData,
  toast,
  useQueryState,
  validateFetchMore,
} from 'erxes-ui';
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

export const useDeals = (options?: QueryHookOptions<{ deals: IDealList }>) => {
  const { data, loading, error, fetchMore, refetch } = useQuery<{
    deals: IDealList;
  }>(GET_DEALS, {
    ...options,
    variables: {
      ...options?.variables,
    },
  });

  const { deals } = data || {};

  const { list = [], pageInfo, totalCount = 0 } = deals || {};

  const { hasPreviousPage, hasNextPage } = pageInfo || {};

  const handleFetchMore = ({
    direction,
  }: {
    direction: EnumCursorDirection;
  }) => {
    if (!validateFetchMore({ direction, pageInfo })) {
      return;
    }

    fetchMore({
      variables: {
        cursor:
          direction === EnumCursorDirection.FORWARD
            ? pageInfo?.endCursor
            : pageInfo?.startCursor,
        limit: 20,
        direction,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          deals: mergeCursorData({
            direction,
            fetchMoreResult: fetchMoreResult.deals,
            prevResult: prev.deals,
          }),
        });
      },
    });
  };

  return {
    deals: data?.deals,
    loading,
    error,
    handleFetchMore,
    pageInfo,
    hasPreviousPage,
    hasNextPage,
    refetch,
    totalCount,
    list,
  };
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
    refetchQueries: [
      {
        query: GET_DEAL_DETAIL,
        variables: {
          ...options?.variables,
          _id,
        },
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: (...args) => {
      toast({
        title: 'Successfully updated a  deal',
        variant: 'default',
      });
      options?.onCompleted?.(...args);
    },
    onError: (err) => {
      toast({
        title: 'Error',
        description: err.message || 'Update failed',
        variant: 'destructive',
      });
    },
  });

  return {
    editDeals,
    loading,
    error,
  };
}

export function useDealsAdd(options?: MutationHookOptions<any, any>) {
  const [_id] = useQueryState('salesItemId');
  const [stageId] = useQueryState('stageId');

  const [addDeals, { loading, error }] = useMutation(ADD_DEALS, {
    ...options,
    variables: {
      ...options?.variables,
      _id,
      stageId,
    },
    refetchQueries: [
      {
        query: GET_DEALS,
        variables: {
          ...options?.variables,
          _id,
        },
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: (...args) => {
      toast({
        title: 'Successfully added a  deal',
        variant: 'default',
      });
      options?.onCompleted?.(...args);
    },
    onError: (err) => {
      toast({
        title: 'Error',
        description: err.message || 'Update failed',
        variant: 'destructive',
      });
    },
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
    refetchQueries: [
      {
        query: GET_DEALS,
        variables: {
          ...options?.variables,
          _id,
        },
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: (...args) => {
      toast({
        title: 'Successfully removed a  deal',
        variant: 'default',
      });
      options?.onCompleted?.(...args);
    },
    onError: (err) => {
      toast({
        title: 'Error',
        description: err.message || 'Update failed',
        variant: 'destructive',
      });
    },
  });

  return {
    removeDeals,
    loading,
    error,
  };
}
