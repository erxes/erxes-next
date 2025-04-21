import { gql } from '@apollo/client';

export const CMS_WEBSITE_ADD = gql`
  mutation ClientPortalConfigUpdate($config: ClientPortalConfigInput!) {
    clientPortalConfigUpdate(config: $config) {
      _id
      __typename
    }
  }
`;
