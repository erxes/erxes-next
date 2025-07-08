import {
  ApolloCache,
  MutationHookOptions,
  OperationVariables,
  useMutation,
} from '@apollo/client';

import { useToast } from 'erxes-ui';
import { IUnitListItem, TUnitForm } from '../types/unit';
import {
  ADD_UNIT,
  EDIT_UNIT,
  REMOVE_UNITS,
} from '../graphql/mutations/unitMutations';
import { GET_UNITS_LIST } from '../graphql';

interface UnitData {
  unitsMain: {
    list: IUnitListItem[];
    totalCount: number;
  };
}
interface AddUnitResult {
  unitsAdd: TUnitForm;
}

export function useUnitAdd(options?: MutationHookOptions<AddUnitResult, any>) {
  const { toast } = useToast();
  const [handleAdd, { loading, error }] = useMutation(ADD_UNIT, {
    ...options,
    update: (cache: ApolloCache<any>, { data }) => {
      try {
        const existingData = cache.readQuery<UnitData>({
          query: GET_UNITS_LIST,
        });
        if (!existingData || !existingData.unitsMain || !data?.unitsAdd) return;

        cache.writeQuery<UnitData>({
          query: GET_UNITS_LIST,
          data: {
            unitsMain: {
              ...existingData.unitsMain,
              list: [data.unitsAdd, ...existingData.unitsMain.list],
              totalCount: existingData.unitsMain.totalCount + 1,
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

export function useUnitEdit(options?: MutationHookOptions<AddUnitResult, any>) {
  const { toast } = useToast();
  const [handleEdit, { loading, error }] = useMutation(EDIT_UNIT, {
    ...options,
    update: (cache: ApolloCache<any>, { data }) => {
      try {
        const existingData = cache.readQuery<UnitData>({
          query: GET_UNITS_LIST,
        });
        if (!existingData || !existingData.unitsMain || !data?.unitsEdit)
          return;

        cache.writeQuery<UnitData>({
          query: GET_UNITS_LIST,
          data: {
            unitsMain: {
              ...existingData.unitsMain,
              list: [data.unitsEdit, ...existingData.unitsMain.list],
              totalCount: existingData.unitsMain.totalCount + 1,
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

export function useRemoveUnit() {
  const { toast } = useToast();
  const [handleRemove, { loading, error }] = useMutation(REMOVE_UNITS, {
    onCompleted: () => toast({ title: 'Removed successfully!' }),
    refetchQueries: ['unitsMain'],
  });

  return {
    handleRemove,
    loading,
    error,
  };
}

export function useUnitInlineEdit() {
  const [_unitsEdit, { loading }] = useMutation(EDIT_UNIT);

  const unitsEdit = (
    operationVariables: OperationVariables,
    fields: string[],
  ) => {
    const variables = operationVariables?.variables || {};
    const fieldsToUpdate: Record<string, () => any> = {};
    fields.forEach((field) => {
      fieldsToUpdate[field] = () => variables[field];
    });
    return _unitsEdit({
      ...operationVariables,
      variables,
      update: (cache, { data: { unitsEdit } }) => {
        cache.modify({
          id: cache.identify(unitsEdit),
          fields: fieldsToUpdate,
        });
      },
    });
  };
  return { unitsEdit, loading };
}
