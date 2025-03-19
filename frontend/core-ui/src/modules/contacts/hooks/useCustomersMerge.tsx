import { OperationVariables, useMutation } from '@apollo/client';
import { CUSTOMERS_MERGE_MUTATION } from '../graphql/mutations/mergeCustomers';
import { GET_CUSTOMERS } from '../graphql/queries/getCustomers';
import { ICustomer } from '../types/customerType';

export const useCustomersMerge = () => {
  const [_customersMerge, { loading, error }] = useMutation(
    CUSTOMERS_MERGE_MUTATION,
  );

  const customersMerge = (operationVariables?: OperationVariables) => {
    return _customersMerge({
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
              const customerIds =
                operationVariables?.variables.customerIds ?? [];

              return {
                customersMain: {
                  ...customersMain,
                  list: [
                    data.customersMerge,
                    ...customersMain.list.filter(
                      (customer: ICustomer) =>
                        !customerIds.includes(customer._id),
                    ),
                  ],
                  totalCount: customersMain.totalCount + 1,
                },
              };
            },
          );
        } catch {
          //
        }
      },
    });
  };

  return { customersMerge, loading, error };
};
