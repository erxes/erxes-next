import { OperationVariables, useQuery } from '@apollo/client';
import { GET_INTEGRATIONS_COUNTS } from '../graphql/queries/getIntegrations';

export const useIntegrationsCounts = (options?: OperationVariables) => {
  const { data, loading, error } = useQuery(GET_INTEGRATIONS_COUNTS, {
    ...options,
  });
  const { integrationsTotalCount } = data || {};
  return {
    byKind: integrationsTotalCount?.byKind || {},
    totalCount: integrationsTotalCount?.total,
    loading,
    error,
  };
};
