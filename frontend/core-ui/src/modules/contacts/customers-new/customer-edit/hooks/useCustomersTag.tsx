import { OperationVariables, useMutation } from '@apollo/client';
import { CUSTOMERS_TAG } from '@/contacts/customer-edit/graphql/mutations/customersEditMutation';

export const useCustomersTag = () => {
  const [_customersTag, { loading }] = useMutation(CUSTOMERS_TAG);
  const customersTag = (
    operationVariables: OperationVariables,
    fields: string[],
  ) => {
    const variables = operationVariables?.variables || {};
    const fieldsToUpdate: Record<string, () => any> = {};
    fields.forEach((field) => {
      fieldsToUpdate[field] = () => variables[field];
    });
    return _customersTag({
      ...operationVariables,
      variables: { type: 'core:customer', ...variables },
    //   update: (cache, { data: { customersTag } }) => {
    //     cache.modify({
    //       id: cache.identify(customersTag),
    //       fields: fieldsToUpdate,
    //     });
    //   },
    });
  };

  return { customersTag, loading };
};
