import { useQuery, OperationVariables } from '@apollo/client';
import { getIntegrations } from '@/inbox/graphql/queries/getIntegrations';

export const useIntegrations = (options?: OperationVariables) => {
  const { data, loading } = useQuery(getIntegrations, options);

  return {
    integrations: data?.integrationsGetUsedTypes,
    conversationCounts: data?.conversationCounts?.byIntegrationTypes,
    loading,
  };
};
