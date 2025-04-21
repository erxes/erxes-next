import { gql } from '@apollo/client';

export const Cp_Configs = gql`
  query clientPortalGetConfigs($searchValue: String) {
    clientPortalGetConfigs(search: $searchValue) {
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
