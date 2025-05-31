import { gql } from '@apollo/client';

export const GET_FACEBOOK_CONVERSATIONS = gql`
  query FacebookConversationMessages(
    $conversationId: String!
    $limit: Int
    $skip: Int
    $getFirst: Boolean
  ) {
    facebookConversationMessages(
      conversationId: $conversationId
      limit: $limit
      skip: $skip
      getFirst: $getFirst
    ) {
      _id
      content
      createdAt
      attachments {
        url
      }
    }
  }
`;
