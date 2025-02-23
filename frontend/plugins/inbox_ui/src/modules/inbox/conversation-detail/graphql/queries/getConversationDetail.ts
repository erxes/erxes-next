import { gql } from '@apollo/client';

export const GET_CONVERSATION_DETAIL = gql`
  query ConversationDetail($_id: String!) {
    conversationDetail(_id: $_id) {
      _id
      createdAt
      tagIds
      integration {
        name
        kind
        brand {
          name
        }
      }
      assignedUserId
      customerId
      updatedAt
    }
  }
`;
