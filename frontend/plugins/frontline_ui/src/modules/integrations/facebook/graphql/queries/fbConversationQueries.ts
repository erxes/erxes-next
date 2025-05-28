import { gql } from '@apollo/client';
import { COMMON_COMMENT_AND_MESSAGE_FIELDS } from './fbFragments';

export const GET_CONVERSATION_MESSAGES = gql`
  query FacebookConversationMessages(
    $conversationId: String!
    $skip: Int
    $limit: Int
    $getFirst: Boolean
  ) {
    facebookConversationMessages(
      conversationId: $conversationId
      skip: $skip
      limit: $limit
      getFirst: $getFirst
    ) {
      _id
      ...CommonCommentAndMessageFields
      customerId
      userId
      createdAt
      isCustomerRead
      internal
      attachments {
        url
        name
        type
        size
      }
      user {
        _id
        username
        details {
          avatar
          fullName
          position
        }
      }
      customer {
        _id
        avatar
        firstName
        middleName
        lastName
        primaryEmail
        primaryPhone
        state
        companies {
          _id
          primaryName
          website
        }
        customFieldsData
        tagIds
      }
    }
  }
  ${COMMON_COMMENT_AND_MESSAGE_FIELDS}
`;

export const GET_CONVERSATION_MESSAGES_COUNT = gql`
  query FacebookConversationMessagesCount($conversationId: String!) {
    facebookConversationMessagesCount(conversationId: $conversationId)
  }
`;

export const HAS_TAGGED_MESSAGES = gql`
  query FacebookHasTaggedMessages($conversationId: String!) {
    facebookHasTaggedMessages(conversationId: $conversationId)
  }
`;
