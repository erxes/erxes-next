import { OperationVariables, useMutation } from '@apollo/client';
import { CUSTOMERS_MERGE_MUTATION } from '../graphql/mutations/mergeCustomers';
import { GET_CUSTOMERS } from '../graphql/queries/getCustomers';
import { ICustomer } from '../types/customerType';

interface ICustomerMergeData {
  customersMerge: ICustomer[];
}
export const useCustomersMerge = () => {
  const [_customersMerge, { loading, error }] = useMutation<ICustomerMergeData>(
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
            ({ customers }) => {
              const customerIds =
                operationVariables?.variables.customerIds ?? [];

              return {
                customers: [
                  data?.customersMerge,
                  ...customers.filter(
                    (customer: ICustomer) =>
                      !customerIds.includes(customer._id),
                  ),
                ],
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
