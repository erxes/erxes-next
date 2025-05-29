import { OperationVariables, useMutation } from '@apollo/client';
import { CUSTOMERS_MERGE_MUTATION } from '../graphql/mutations/mergeCustomers';
import { ICustomer } from 'ui-modules';
import { useRecordTableCursor } from 'erxes-ui';
import { CUSTOMERS_CURSOR_SESSION_KEY } from '../constants/customersCursorSessionKey';
interface ICustomerMergeData {
  mergeCustomers: ICustomer[];
}

export const useMergeCustomers = () => {
  const { setCursor } = useRecordTableCursor({
    sessionKey: CUSTOMERS_CURSOR_SESSION_KEY,
  });
  const [_mergeCustomers, { loading, error }] = useMutation<ICustomerMergeData>(
    CUSTOMERS_MERGE_MUTATION,
  );

  const mergeCustomers = (options?: OperationVariables) => {
    return _mergeCustomers({
      ...options,
      onCompleted: (data) => {
        options?.onCompleted?.(data);
        setTimeout(() => {
          setCursor(null);
        }, 100);
      },
    });
  };

  return { mergeCustomers, loading, error };
};
