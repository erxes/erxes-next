import { OperationVariables, useMutation } from '@apollo/client';
import { CUSTOMERS_MERGE_MUTATION } from '../graphql/mutations';

export const useCustomersMerge = (options?: OperationVariables) => {
  const [customersMerge, { loading, error }] = useMutation(
    CUSTOMERS_MERGE_MUTATION,
    options,
  );
  return { customersMerge, loading, error };
};
