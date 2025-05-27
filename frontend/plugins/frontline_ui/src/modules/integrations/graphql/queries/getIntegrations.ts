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
