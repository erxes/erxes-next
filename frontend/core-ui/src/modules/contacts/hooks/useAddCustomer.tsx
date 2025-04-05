import { useMutation, OperationVariables } from '@apollo/client';
import { ADD_CUSTOMERS } from '@/contacts/graphql/mutations/addCustomers';
import { GET_CUSTOMERS } from '../graphql/queries/getCustomers';
import { ICustomer } from '../types/customerType';

interface ICustomerAddData {
  customersAdd: ICustomer[];
}
export function useAddCustomer() {
  const [_customersAdd, { loading, error }] =
    useMutation<ICustomerAddData>(ADD_CUSTOMERS);
  const customersAdd = (operationVariables: OperationVariables) => {
    return _customersAdd({
      ...operationVariables,
      update: (cache, { data }) => {
        try {
          cache.updateQuery(
            {
              query: GET_CUSTOMERS,
              variables: {
                perPage: 30,
                dateFilters: null,
              },
            },
            ({ customers }) => {
              return {
                customers: [data?.customersAdd, ...customers],
              };
            },
          );
        } catch {
          // console.log(e);
        }
      },
    });
  };

  return { customersAdd, loading, error };
}
