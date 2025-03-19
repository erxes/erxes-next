import { useQuery, OperationVariables } from '@apollo/client';
import { GET_ACCOUNTS } from '../graphql/queries/getAccounts';

const ACCOUNTS_PER_PAGE = 20;

export const useAccounts = (options?: OperationVariables) => {
  const { data, loading, error, fetchMore } = useQuery(GET_ACCOUNTS, options);
  const { accounts, accountsCount: totalCount } = data || {};
  const handleFetchMore = () => {
    if (accounts?.length < totalCount) {
      fetchMore({
        variables: {
          perPage: ACCOUNTS_PER_PAGE,
          page: Math.ceil(accounts?.length / ACCOUNTS_PER_PAGE) + 1,
        },
      });
    }
  };

  return {
    accounts,
    loading,
    error,
    handleFetchMore,
    totalCount,
  };
};
