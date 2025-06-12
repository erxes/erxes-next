import { useQuery } from '@apollo/client';
import { GET_INTEGRATION_KINDS } from '../graphql/queries/getIntegrations';

export const useUsedIntegrationTypes = () => {
  const { data, loading } = useQuery(GET_INTEGRATION_KINDS);

  return {
    integrationTypes: data?.integrationsGetUsedTypes || [],
    loading,
  };
};
