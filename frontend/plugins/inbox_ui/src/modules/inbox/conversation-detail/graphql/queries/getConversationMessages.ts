import { gql } from '@apollo/client';

export const GET_CONVERSATION_MESSAGES = gql`
  query ConversationMessages(
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
      formWidgetData
      attachments {
        name
        type
        url
      }
      internal
      createdAt
      isCustomerRead
      userId
      customerId
    }
    conversationMessagesTotalCount(conversationId: $conversationId)
  }
`;
