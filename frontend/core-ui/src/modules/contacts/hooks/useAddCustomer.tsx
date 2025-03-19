import { useMutation, OperationVariables } from '@apollo/client';
import { ADD_CUSTOMERS } from '@/contacts/graphql/mutations/addCustomers';
import { GET_CUSTOMERS } from '../graphql/queries/getCustomers';
export function useAddCustomer() {
  const [_customersAdd, { loading, error }] = useMutation(ADD_CUSTOMERS);
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
            ({ customersMain }) => {
              return {
                customersMain: {
                  ...customersMain,
                  list: [data.customersAdd, ...customersMain.list],
                  totalCount: customersMain.totalCount + 1,
                },
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
