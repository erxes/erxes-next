import { gql } from '@apollo/client';
import {
  GQL_CURSOR_PARAM_DEFS,
  GQL_CURSOR_PARAMS,
  GQL_PAGE_INFO,
} from 'erxes-ui';
export const GET_INTEGRATIONS_COUNTS = gql`
  query totalIntegrationsCount {
    integrationsTotalCount {
      total
      byKind
      __typename
    }
  }
`;

export const GET_INTEGRATIONS_BY_KIND = gql`
  query integrations(
    $channelId: String
    $brandId: String
    $kind: String
    $perPage: Int
    $page: Int
    $searchValue: String
    $status: String
    ${GQL_CURSOR_PARAM_DEFS}
  ) {
    integrations(
      channelId: $channelId
      brandId: $brandId
      kind: $kind
      perPage: $perPage
      page: $page
      searchValue: $searchValue
      status: $status
      ${GQL_CURSOR_PARAMS}
    ) {
      list {
        _id
        name
        brandId
        languageCode
        isActive
        kind
        createdAt
        healthStatus
        details
        webhookData
        leadData
        formId
        tagIds

        channels {
          _id
          name
        }

        brand {
          _id
          name
          code
        }

        tags {
          _id
          name
          colorCode
        }

        form {
          _id
          title
          code
        }
      }

      ${GQL_PAGE_INFO}
    }
  }
`;
