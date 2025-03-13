import { useQuery, OperationVariables } from '@apollo/client';
import { GET_ACCOUNTS } from '../graphql/queries/getAccounts';

export const useAccounts = (options?: OperationVariables) => {
  const { data, loading, error } = useQuery(GET_ACCOUNTS, options);

  return {
    accounts: data?.accounts,
    loading,
    error,
  };
};
