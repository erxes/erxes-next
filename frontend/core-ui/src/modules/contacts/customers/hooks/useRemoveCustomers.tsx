import { OperationVariables, useMutation } from '@apollo/client';
import { CUSTOMERS_REMOVE } from '@/contacts/customers/graphql/mutations/removeCustomers';
import { GET_CUSTOMERS } from '@/contacts/customers/graphql/queries/getCustomers';
import { ICustomer } from 'ui-modules';

export const useRemoveCustomers = () => {
  const [_removeCustomers, { loading }] = useMutation(CUSTOMERS_REMOVE);

  const removeCustomers = async (
    customerIds: string[],
    options?: OperationVariables,
  ) => {
    await _removeCustomers({
      ...options,
      variables: { customerIds, ...options?.variables },
      update: (cache) => {
        try {
          cache.updateQuery(
            {
              query: GET_CUSTOMERS,
              variables: { perPage: 30, dateFilters: null },
            },
            ({ customersMain }) => ({
              customersMain: {
                ...customersMain,
                list: customersMain.list.filter(
                  (customer: ICustomer) => !customerIds.includes(customer._id),
                ),
                totalCount: customersMain.totalCount - customerIds.length,
              },
            }),
          );
        } catch (e) {
          console.log(e);
        }
      },
    });
  };

  return { removeCustomers, loading };
};
