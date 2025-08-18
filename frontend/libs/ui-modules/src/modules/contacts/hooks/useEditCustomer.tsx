import { MutationHookOptions, useMutation } from '@apollo/client';
import { EDIT_CUSTOMERS } from '../graphql/mutations/editCustomers';
import { useToast } from 'erxes-ui';

export const useCustomerEdit = () => {
  const [customerEdit, { loading }] = useMutation(EDIT_CUSTOMERS);
  const { toast } = useToast();

  const mutate = ({ variables, ...options }: MutationHookOptions) => {
    customerEdit({
      ...options,
      variables,
      update: (cache, { data: { customersEdit } }) => {
        cache.modify({
          id: cache.identify(customersEdit),
          fields: Object.keys(variables || {}).reduce(
            (fields: Record<string, () => any>, field) => {
              fields[field] = () => (variables || {})[field];
              return fields;
            },
            {},
          ),
          optimistic: true,
        });
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message,
        });
      },
    });
  };

  return { customerEdit: mutate, loading };
};
