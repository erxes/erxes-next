import { gql } from '@apollo/client';
import {
  COMMON_COMMENT_AND_MESSAGE_FIELDS,
  COMMON_POST_AND_COMMENT_FIELDS,
} from './fbFragments';

export const GET_COMMENTS = gql`
  query FacebookGetComments(
    $conversationId: String!
    $getFirst: Boolean
    $skip: Int
    $limit: Int
  ) {
    facebookGetComments(
      conversationId: $conversationId
      getFirst: $getFirst
      skip: $skip
      limit: $limit
    ) {
      _id
      content
      conversationId
      attachments {
        url
        name
        type
        size
        duration
      }
      customerId
      userId
      createdAt
      commentId
      customer {
        _id
      }
      user {
        _id
      }
    }
  }
`;

export const GET_COMMENT_COUNT = gql`
  query FacebookGetCommentCount(
    $conversationId: String!
    $isResolved: Boolean
  ) {
    facebookGetCommentCount(
      conversationId: $conversationId
      isResolved: $isResolved
    )
  }
`;
