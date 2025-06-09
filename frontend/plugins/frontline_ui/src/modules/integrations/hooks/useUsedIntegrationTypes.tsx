import { useQuery } from '@apollo/client';
import { GET_INTEGRATION_TYPES } from '../graphql/queries/getIntegrations';

export const useUsedIntegrationTypes = () => {
  const { data, loading } = useQuery(GET_INTEGRATION_TYPES);

  return {
    integrationTypes: data?.integrationsGetUsedTypes || [],
    loading,
  };
};
