import { OperationVariables, useMutation } from '@apollo/client';
import { EDIT_BRANDS } from '../graphql';

export function useBrandsEdit() {
  const [_brandsEdit, { loading, error }] = useMutation(EDIT_BRANDS);

  const handleEdit = (
    operationVariables: OperationVariables,
    fields: string[],
  ) => {
    const variables = operationVariables?.variables || {};
    const fieldsToUpdate: Record<string, () => any> = {};
    fields.forEach((field) => {
      fieldsToUpdate[field] = () => variables[field];
    });
    return _brandsEdit({
      ...operationVariables,
      variables,
      update: (cache, { data: { brandsEdit } }) => {
        cache.modify({
          id: cache.identify(brandsEdit),
          fields: fieldsToUpdate,
        });
      },
    });
  };

  return {
    handleEdit,
    loading,
    error,
  };
}
