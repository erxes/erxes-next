import { OperationVariables, useMutation } from '@apollo/client';
import { ACCOUNTS_ADD } from '../graphql/mutations/accounts';
import { toast } from 'erxes-ui';
import { GET_ACCOUNTS } from '../graphql/queries/getAccounts';
import { ACCOUNTS_PER_PAGE } from './useAccounts';

export const useAccountAdd = () => {
  const [_addAccount, { loading }] = useMutation(ACCOUNTS_ADD);

  const addAccount = (options: OperationVariables) => {
    return _addAccount({
      variables: options.variables,
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
        options.onError?.(error);
      },
      update: (cache, { data }) => {
        cache.writeQuery({
          query: GET_ACCOUNTS,
          variables: {
            perPage: ACCOUNTS_PER_PAGE,
            page: 1,
          },
          data: {
            accounts: {
              ...data.accounts,
              list: [
                { ...data.accountsAdd, ...options.variables },
                ...data.accounts.list,
              ],
            },
          },
        });
      },
    });
  };

  return { addAccount, loading };
};
