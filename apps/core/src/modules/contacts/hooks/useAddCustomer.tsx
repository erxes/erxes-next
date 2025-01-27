import { ADD_CUSTOMERS } from '@/contacts/graphql/mutations/addCustomers';
import { useMutation } from '@apollo/client';
import { OperationVariables } from '@apollo/client';

export function useAddCustomer(options?: OperationVariables) {
  const [customersAdd, { loading, error }] = useMutation(
    ADD_CUSTOMERS,
    options,
  );

  return { customersAdd, loading, error };
}
