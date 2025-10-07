import { integrationIdAtom } from '@/components/messenger/atoms';
import { messengerSupportersQuery } from '@/components/messenger/graphql/queries';
import { ISupporter } from '@/types';
import { QueryHookOptions, useQuery } from '@apollo/client';
import { useAtomValue } from 'jotai';

interface IQueryResponse {
  widgetsMessengerSupporters: {
    supporters: ISupporter[];
    isOnline: boolean;
  };
}

export const useGetMessengerSupporters = (
  options?: QueryHookOptions<IQueryResponse>,
) => {
  const integrationId = useAtomValue(integrationIdAtom);
  const { data, loading, error } = useQuery<IQueryResponse>(
    messengerSupportersQuery,
    {
      ...options,
      variables: {
        integrationId,
      },
      skip: !integrationId,
    },
  );
  return {
    list: data?.widgetsMessengerSupporters.supporters,
    isOnline: data?.widgetsMessengerSupporters.isOnline,
    loading,
    error,
  };
};
