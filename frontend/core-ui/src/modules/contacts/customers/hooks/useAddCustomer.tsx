import { useMutation, ApolloCache, MutationHookOptions } from '@apollo/client';
import { ADD_CUSTOMERS } from '@/contacts/customers/graphql/mutations/addCustomers';
import { GET_CUSTOMERS } from '@/contacts/customers/graphql/queries/getCustomers';
import { ICustomer } from '@/contacts/types/customerType';

interface CustomerData {
  customers: {
    list: ICustomer[];
    totalCount: number;
  };
}

interface AddCustomerResult {
  customersAdd: ICustomer;
}

export function useAddCustomer(
  options?: MutationHookOptions<AddCustomerResult, any>,
) {
  const [customersAdd, { loading, error }] = useMutation<AddCustomerResult>(
    ADD_CUSTOMERS,
    {
      ...options,
      update: (cache: ApolloCache<any>, { data }) => {
        try {
          const queryVariables = { perPage: 30, dateFilters: null };
          const existingData = cache.readQuery<CustomerData>({
            query: GET_CUSTOMERS,
            variables: queryVariables,
          });
          if (!existingData || !existingData.customers || !data?.customersAdd)
            return;

          cache.writeQuery<CustomerData>({
            query: GET_CUSTOMERS,
            variables: queryVariables,
            data: {
              customers: {
                ...existingData.customers,
                list: [data.customersAdd, ...existingData.customers.list],
                totalCount: existingData.customers.totalCount + 1,
              },
            },
          });
        } catch (e) {
          console.error('error:', e);
        }
      },
    },
  );

  return { customersAdd, loading, error };
}
