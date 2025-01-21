import { ADD_CUSTOMERS } from '@/contacts/graphql/mutations/addCustomers';
import { useMutation } from '@apollo/client';

export function useAddCustomer() {
  const [customersAdd, { loading, error, data }] = useMutation(
    ADD_CUSTOMERS
  );

  const addCustomer = async (customersData) => {
    try {
      console.log(customersData);
      const response = await customersAdd({
        variables: customersData,
      });
      return response.data.addCustomer;
    } catch (error) {
      console.error('Add customer error:', error);
      throw error;
    }
  };

  return { addCustomer, loading, error, data };
}
