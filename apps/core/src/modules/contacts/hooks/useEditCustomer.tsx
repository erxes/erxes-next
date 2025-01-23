import { MutationHookOptions, useMutation } from '@apollo/client';
import { EDIT_CUSTOMERS } from '../graphql/mutations/editCustomers';

export const useCustomerEdit = () => {
  const [customerEdit, { loading }] = useMutation(
    EDIT_CUSTOMERS
  );

  const mutate = ({ variables, ...options }: MutationHookOptions) => {
    customerEdit({
      ...options,
      variables,
      update: (cache, { data: { customerEdit } }) => {
        cache.modify({
          id: cache.identify(customerEdit),
          fields: Object.keys(variables || {}).reduce((fields, field) => {
            fields[field] = () => (variables || {})[field];
            return fields;
          }, {}),
          optimistic: true,
        });
      },
    });
  };

  return { customerEdit: mutate, loading };
};
