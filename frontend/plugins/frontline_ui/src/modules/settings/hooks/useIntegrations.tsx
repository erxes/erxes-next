import { OperationVariables, useQuery } from '@apollo/client';
import { GET_INTEGRATIONS_BY_KIND } from '../graphql/queries/getIntegrations';

export const useIntegrations = (options?: OperationVariables) => {
  const { data, error, loading } = useQuery(GET_INTEGRATIONS_BY_KIND, {
    variables: options, 
  });

  const integrations = data?.integrations?.list || [];

  return {
    integrations,
    loading,
    error
  };
};
