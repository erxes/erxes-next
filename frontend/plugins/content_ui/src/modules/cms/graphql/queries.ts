import { gql } from '@apollo/client';

export const GET_WEBSITES = gql`
  query clientPortalGetConfigs($search: String) {
    clientPortalGetConfigs(search: $search) {
      list {
        _id
        name
        description
        domain
        createdAt
        kind
        url
        __typename
      }
      totalCount
    }
  }
`;

export const CLIENT_PORTAL_CONFIG_UPDATE = gql`
  mutation ClientPortalConfigUpdate($config: ClientPortalConfigInput!) {
    clientPortalConfigUpdate(config: $config) {
      _id
      name
      description
      domain
      createdAt
      kind
      url
      __typename
    }
  }
`;
