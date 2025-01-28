import { useQuery } from '@apollo/client';
import { GET_USERS } from '@/contacts/graphql/queries/getUsers';
import { QueryHookOptions } from '@apollo/client';
export const useUsers = (options?: QueryHookOptions) => {
  const { data, loading } = useQuery(GET_USERS, {
    ...options
  });
  return {
    users: data?.users || [],
    loading
  };
};
