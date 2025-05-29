import { gql } from '@apollo/client';
import { ATTACHMENT_GQL } from 'erxes-ui/constants';

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
      ...CommonCommentAndMessageFields
      ${ATTACHMENT_GQL}
      customerId
      userId
      createdAt
      commentId
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
