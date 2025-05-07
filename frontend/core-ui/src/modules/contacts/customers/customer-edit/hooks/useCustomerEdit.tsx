import { OperationVariables, useMutation } from '@apollo/client';
import { CUSTOMERS_EDIT } from '../graphql/mutations/customersEditMutation';

export const useCustomersEdit = () => {
  const [_customersEdit, { loading }] = useMutation(CUSTOMERS_EDIT);

  const customersEdit = (
    operationVariables: OperationVariables,
    fields: string[],
  ) => {
    const variables = operationVariables?.variables || {};
    const fieldsToUpdate: Record<string, () => any> = {};
    fields.forEach((field) => {
      fieldsToUpdate[field] = () => variables[field];
    });
    return _customersEdit({
      ...operationVariables,
      variables,
      update: (cache, { data: { customersEdit } }) => {
        cache.modify({
          id: cache.identify(customersEdit),
          fields: fieldsToUpdate,
        });
      },
    });
  };

  return { customersEdit, loading };
};
