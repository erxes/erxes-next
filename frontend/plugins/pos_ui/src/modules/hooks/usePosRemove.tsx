import { OperationVariables, useMutation } from '@apollo/client';
import { IPos } from '../types/pos';
import { mutations, queries } from '../graphql';

export const useRemovePos = () => {
  const [_removePos, { loading }] = useMutation(mutations.posRemove);

  const removePos = async (
    posIds: string | string[],
    options?: OperationVariables,
  ) => {
    await _removePos({
      ...options,
      variables: {
        _id: posIds,
        ...options?.variables
      },
      update: (cache) => {
        try {
          cache.updateQuery(
            {
              query: queries.posList,
              variables: { perPage: 30, dateFilters: null }, 
            },
            ({ posMain }) => ({ 
              posMain: {
                ...posMain,
                list: posMain.list.filter(
                  (pos: IPos) => pos._id !== posIds,
                ),
                totalCount: posMain.totalCount - 1,
              },
            }),
          );
        } catch (e) {
          console.log(e);
        }
      },
    });
  };

  return { removePos, loading };
};