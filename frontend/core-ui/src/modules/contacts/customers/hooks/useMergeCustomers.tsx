import { OperationVariables, useMutation } from '@apollo/client';
import { CUSTOMERS_MERGE_MUTATION } from '../graphql/mutations/mergeCustomers';
import { GET_CUSTOMERS } from '../graphql/queries/getCustomers';
import { ICustomer } from 'ui-modules';

interface ICustomerMergeData {
  mergeCustomers: ICustomer[];
}
export const useMergeCustomers = () => {
  const [_mergeCustomers, { loading, error }] = useMutation<ICustomerMergeData>(
    CUSTOMERS_MERGE_MUTATION,
  );

  const mergeCustomers = (operationVariables?: OperationVariables) => {
    return _mergeCustomers({
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
                  data?.mergeCustomers,
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

  return { mergeCustomers, loading, error };
};
