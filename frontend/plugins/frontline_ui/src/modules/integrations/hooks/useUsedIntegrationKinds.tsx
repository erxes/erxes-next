import { useQuery } from '@apollo/client';
import { GET_INTEGRATION_KINDS } from '../graphql/queries/getIntegrations';

export const useUsedIntegrationKinds = () => {
  const { data, loading } = useQuery(GET_INTEGRATION_KINDS);

  return {
    integrationKinds: data?.integrationsGetUsedTypes || [],
    loading,
  };
};
