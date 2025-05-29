import { gql } from '@apollo/client';

export const getIntegrations = gql`
  query integrationsGetUsedTypes($limit: Int, $only: String) {
    integrationsGetUsedTypes {
      _id
      name
    }
    conversationCounts(limit: $limit, only: $only)
  }
`;

export const INTEGRATION_DETAIL = gql`
  query IntegrationDetail($id: String!) {
    integrationDetail(_id: $id) {
      _id
      kind
      brand {
        _id
        name
      }
    }
  }
`;
