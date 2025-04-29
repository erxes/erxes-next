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

export const GET_INTEGRATIONS_BY_KIND = gql`
  query integrations(
    $channelId: String
    $brandId: String
    $kind: String
    $perPage: Int
    $page: Int
    $searchValue: String
    $status: String
  ) {
    integrations(
      channelId: $channelId
      brandId: $brandId
      kind: $kind
      perPage: $perPage
      page: $page
      searchValue: $searchValue
      status: $status
    ) {
      _id
      name
      brandId
      languageCode
      isActive
      channels {
        _id
        name
      }
      kind
      brand {
        _id
        name
        code
      }
      createdAt
      webhookData
      leadData
      formId
      tagIds
      tags {
        _id
        colorCode
        name
      }
      form {
        _id
        title
        code
      }
      details
      healthStatus
    }
  }
`;
