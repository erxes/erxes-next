import { ApolloCache, MutationHookOptions, useMutation } from '@apollo/client';

import { useToast } from 'erxes-ui';
import { IPositionListItem, TPositionForm } from '../types/position';
import {
  ADD_POSITION,
  EDIT_POSITION,
  GET_POSITIONS_LIST,
  REMOVE_POSITIONS,
} from '../graphql';

interface PositionData {
  positionsMain: {
    list: IPositionListItem[];
    totalCount: number;
  };
}
interface AddPositionResult {
  positionsAdd: TPositionForm;
}

export function usePositionAdd(
  options?: MutationHookOptions<AddPositionResult, any>,
) {
  const { toast } = useToast();
  const [handleAdd, { loading, error }] = useMutation(ADD_POSITION, {
    ...options,
    update: (cache: ApolloCache<any>, { data }) => {
      try {
        const existingData = cache.readQuery<PositionData>({
          query: GET_POSITIONS_LIST,
        });
        if (!existingData || !existingData.positionsMain || !data?.positionsAdd)
          return;

        cache.writeQuery<PositionData>({
          query: GET_POSITIONS_LIST,
          data: {
            positionsMain: {
              ...existingData.positionsMain,
              list: [data.positionsAdd, ...existingData.positionsMain.list],
              totalCount: existingData.positionsMain.totalCount + 1,
            },
          },
        });
      } catch (e) {
        console.log('error', e);
      }
    },
  });

  return {
    handleAdd,
    loading,
    error,
  };
}

export function usePositionEdit(
  options?: MutationHookOptions<AddPositionResult, any>,
) {
  const { toast } = useToast();
  const [handleEdit, { loading, error }] = useMutation(EDIT_POSITION, {
    ...options,
    update: (cache: ApolloCache<any>, { data }) => {
      try {
        const existingData = cache.readQuery<PositionData>({
          query: GET_POSITIONS_LIST,
        });
        if (
          !existingData ||
          !existingData.positionsMain ||
          !data?.positionsEdit
        )
          return;

        cache.writeQuery<PositionData>({
          query: GET_POSITIONS_LIST,
          data: {
            positionsMain: {
              ...existingData.positionsMain,
              list: [data.positionsEdit, ...existingData.positionsMain.list],
              totalCount: existingData.positionsMain.totalCount + 1,
            },
          },
        });
      } catch (e) {
        console.log('error', e);
      }
    },
  });

  return {
    handleEdit,
    loading,
    error,
  };
}

export function useRemovePosition() {
  const { toast } = useToast();
  const [handleRemove, { loading, error }] = useMutation(REMOVE_POSITIONS, {
    onCompleted: () => toast({ title: 'Removed successfully!' }),
    refetchQueries: [GET_POSITIONS_LIST],
  });

  return {
    handleRemove,
    loading,
    error,
  };
}
