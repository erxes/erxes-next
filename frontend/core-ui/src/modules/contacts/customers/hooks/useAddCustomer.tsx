import { useMutation, MutationFunctionOptions } from '@apollo/client';
import { ADD_CUSTOMERS } from '@/contacts/customers/graphql/mutations/addCustomers';
import { GET_CUSTOMERS } from '@/contacts/customers/graphql/queries/getCustomers';
import { ICustomer } from '@/contacts/types/customerType';
import { useRecordTableCursor } from 'erxes-ui';
import { CUSTOMERS_CURSOR_SESSION_KEY } from '@/contacts/customers/constants/customersCursorSessionKey';

interface AddCustomerResult {
  customersAdd: ICustomer;
}

export function useAddCustomer() {
  const { setCursor, cursor } = useRecordTableCursor({
    sessionKey: CUSTOMERS_CURSOR_SESSION_KEY,
  });
  console.log('cursor', cursor);
  const [customersAdd, { loading, error }] =
    useMutation<AddCustomerResult>(ADD_CUSTOMERS);

  const handleCustomersAdd = (
    options: MutationFunctionOptions<AddCustomerResult, any>,
  ) => {
    customersAdd({
      ...options,
      onCompleted: (data) => {
        setCursor(null);
        options?.onCompleted?.(data);
      },
      refetchQueries: () => [
        {
          query: GET_CUSTOMERS,
        },
      ],
    });
  };
  return { customersAdd: handleCustomersAdd, loading, error };
}
