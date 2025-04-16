import { gql } from '@apollo/client';

export const GET_INTEGRATIONS_COUNTS = gql`
  query totalIntegrationsCount {
    integrationsTotalCount {
      total
      byKind
      __typename
    }
  }
`;
