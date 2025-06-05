import { gql } from '@apollo/client';

export const COMMON_POST_AND_COMMENT_FIELDS = gql`
  fragment CommonPostAndCommentFields on FacebookPost {
    postId
    recipientId
    senderId
    erxesApiId
    attachments
    timestamp
    permalink_url
    content
  }
`;
