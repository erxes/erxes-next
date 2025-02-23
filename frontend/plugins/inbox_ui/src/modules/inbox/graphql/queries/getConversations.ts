import { gql } from '@apollo/client';

export const GET_CONVERSATIONS = gql`
  query Conversations(
    $limit: Int
    $channelId: String
    $status: String
    $unassigned: String
    $brandId: String
    $tag: String
    $integrationType: String
    $starred: String
    $startDate: String
    $endDate: String
    $segment: String
    $skip: Int
    $awaitingResponse: String
    $participating: String
  ) {
    conversations(
      limit: $limit
      channelId: $channelId
      status: $status
      unassigned: $unassigned
      brandId: $brandId
      tag: $tag
      integrationType: $integrationType
      starred: $starred
      startDate: $startDate
      endDate: $endDate
      segment: $segment
      skip: $skip
      awaitingResponse: $awaitingResponse
      participating: $participating
    ) {
      _id
      content
      createdAt
      updatedAt
      integration {
        name
        kind
        brand {
          name
        }
      }
      customer {
        firstName
        middleName
        lastName
        primaryEmail
        avatar
      }
      readUserIds
    }
    conversationsTotalCount(
      limit: $limit
      channelId: $channelId
      status: $status
      unassigned: $unassigned
      brandId: $brandId
      tag: $tag
      integrationType: $integrationType
      starred: $starred
      startDate: $startDate
      endDate: $endDate
      segment: $segment
      participating: $participating
      awaitingResponse: $awaitingResponse
    )
  }
`;
