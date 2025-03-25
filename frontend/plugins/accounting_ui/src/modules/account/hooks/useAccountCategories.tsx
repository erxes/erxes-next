import { OperationVariables, useQuery } from '@apollo/client';
import { GET_ACCOUNT_CATEGORIES } from '../graphql/queries/getAccountCategory';

export const useAccountCategories = (options?: OperationVariables) => {
  const { data, loading, error } = useQuery(GET_ACCOUNT_CATEGORIES, options);
  return { accountCategories: data?.accountCategories, loading, error };
};
