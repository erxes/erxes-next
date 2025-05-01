import { OperationVariables, useQuery } from '@apollo/client'
import React from 'react'
import { GET_INTEGRATIONS_BY_KIND } from '../graphql/queries/getIntegrations'

export const useIntegrations = (options?: OperationVariables) => {
  const { data, error, loading } = useQuery(GET_INTEGRATIONS_BY_KIND, {...options});
  const integrations = data && data.integrations || [];

  return {
    integrations,
    loading,
    error
  }
}
