import { OperationVariables, useQuery } from '@apollo/client';
import { GET_POSITIONS_LIST } from '../graphql';
import { useMultiQueryState } from 'erxes-ui';
import { IPositionListItem } from '../types/position';

export const usePositionsList = (options?: OperationVariables) => {
  const [{ searchValue }] = useMultiQueryState<{
    searchValue: string;
  }>(['searchValue']);
  const { data, loading, error } = useQuery(GET_POSITIONS_LIST, {
    variables: {
      ...options?.variables,
      searchValue,
    },
    ...options,
  });

  const positions = data?.positionsMain?.list || [];
  const positionsWithHasChildren = positions?.map(
    (position: IPositionListItem) => ({
      ...position,
      hasChildren: positions?.some(
        (b: IPositionListItem) => b.parentId === position._id,
      ),
    }),
  );
  return {
    positions: positionsWithHasChildren,
    sortedPositions: [...(positionsWithHasChildren || [])].sort((a, b) =>
      (a.order ?? '')?.localeCompare(b.order ?? ''),
    ),
    totalCount: data ? data.positionsMain.totalCount : 0,
    loading,
    error,
  };
};
