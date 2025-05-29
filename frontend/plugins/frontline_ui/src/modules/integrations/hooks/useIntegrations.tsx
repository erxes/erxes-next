import { useQuery, OperationVariables } from '@apollo/client';
import {
  getIntegrations,
  INTEGRATION_DETAIL,
} from '@/integrations/graphql/queries/getIntegrations';
import { IIntegration } from '@/integrations/types/Integration';

export const useIntegrations = (options?: OperationVariables) => {
  const { data, loading } = useQuery<{
    integrationsGetUsedTypes: IIntegration[];
    conversationCounts: {
      byIntegrationTypes: {
        _id: string;
        count: number;
      }[];
    };
  }>(getIntegrations, options);

  return {
    integrations: data?.integrationsGetUsedTypes,
    conversationCounts: data?.conversationCounts?.byIntegrationTypes,
    loading,
  };
};

export const useIntegrationDetail = (options?: OperationVariables) => {
  const { data, loading } = useQuery<{
    integrationDetail: IIntegration;
  }>(INTEGRATION_DETAIL, options);

  return {
    integration: data?.integrationDetail,
    loading,
  };
};
