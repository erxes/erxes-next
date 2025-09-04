import { GET_APPS } from '@/settings/apps/graphql';
import { IApp } from '@/settings/apps/types';
import { QueryHookOptions, useQuery } from '@apollo/client';

interface IApssResponse {
  apps: IApp[];
}

export const useAppsTokens = (options?: QueryHookOptions<IApssResponse>) => {
  const { data, error, loading } = useQuery<IApssResponse>(GET_APPS, {
    ...options,
  });
  const apps = data?.apps || [];
  return {
    apps,
    loading,
    error,
  };
};
