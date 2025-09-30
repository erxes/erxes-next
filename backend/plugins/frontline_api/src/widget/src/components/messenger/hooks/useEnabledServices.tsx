import { GET_ENABLED_SERVICES } from '@/components/messenger/graphql/queries';
import { useQuery } from '@apollo/client';

export const useEnabledServices = () => {
  const { data, loading, error } = useQuery(GET_ENABLED_SERVICES, {
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });
  
  const list = data?.enabledServices || [];
  
  return {
    enabledServices: list,
    loading,
    error,
  };
};
