import { OperationVariables, useMutation } from '@apollo/client';
import { CUSTOMERS_EDIT } from '@/contacts/customer-edit/graphql/mutations/customersEditMutation';

export const useCustomersEdit = () => {
  const [_customersEdit, { loading }] = useMutation(CUSTOMERS_EDIT);

  const customersEdit = (
    operationVariables: OperationVariables,
    field: string,
  ) => {
    const variables = operationVariables?.variables || {};
    return _customersEdit({
      ...operationVariables,
      variables,
      update: (cache, { data: { customersEdit } }) => {
        cache.modify({
          id: cache.identify(customersEdit),
          fields: {
            [field]: () => variables[field],
          },
        });
      },
    });
  };

  return { customersEdit, loading };
};
