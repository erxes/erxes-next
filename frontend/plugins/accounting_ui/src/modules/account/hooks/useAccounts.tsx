import { useQuery, OperationVariables } from '@apollo/client';
import { GET_ACCOUNTS } from '../graphql/queries/getAccounts';
import { useMultiQueryState } from 'erxes-ui';
export const ACCOUNTS_PER_PAGE = 20;

export const useAccounts = (options?: OperationVariables) => {
  const [{ code, name, categoryId, currency, kind, journal }] =
    useMultiQueryState([
      'code',
      'name',
      'categoryId',
      'currency',
      'kind',
      'journal',
    ]);
  const { data, loading, error, fetchMore } = useQuery(GET_ACCOUNTS, {
    ...options,
    variables: {
      page: 1,
      perPage: ACCOUNTS_PER_PAGE,
      code: code ?? undefined,
      name: name ?? undefined,
      categoryId: categoryId ?? undefined,
      currency: currency ?? undefined,
      kind: kind ?? undefined,
      journals: journal ? [journal] : undefined,
      ...options?.variables,
    },
  });
  const { accounts, accountsCount: totalCount } = data || {};
  const handleFetchMore = () => {
    if (accounts?.length < totalCount) {
      fetchMore({
        variables: {
          perPage: ACCOUNTS_PER_PAGE,
          page: Math.ceil(accounts?.length / ACCOUNTS_PER_PAGE) + 1,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          return {
            ...prev,
            ...fetchMoreResult,
            accounts: [...prev.accounts, ...fetchMoreResult.accounts],
          };
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
