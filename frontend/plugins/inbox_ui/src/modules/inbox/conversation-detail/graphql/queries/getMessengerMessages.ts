import { gql } from '@apollo/client';

export const GET_MESSENGER_MESSAGES = gql`
  query MessengerMessages(
    $conversationId: String!
    $skip: Int
    $limit: Int
    $getFirst: Boolean
  ) {
    conversationMessages(
      conversationId: $conversationId
      skip: $skip
      limit: $limit
      getFirst: $getFirst
    ) {
      _id
      content
      attachments {
        name
        type
        url
      }
      createdAt
      isCustomerRead
      customerId
      userId
    }
    conversationMessagesTotalCount(conversationId: $conversationId)
  }
`;
