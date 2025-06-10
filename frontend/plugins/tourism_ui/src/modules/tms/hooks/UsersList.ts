import { useQuery } from '@apollo/client';
import { USERS_LIST } from '../graphql/queries';
import { IUser } from '../types/branch';

interface UsersListResponse {
  users: {
    totalCount: number;
    list: IUser[];
  };
}

export const UsersList = () => {
  const { data, loading, error } = useQuery<UsersListResponse>(USERS_LIST);

  const list = data?.users?.list || [];

  return { list, loading, error };
};
