import { gql } from '@apollo/client';
import { COMMON_POST_AND_COMMENT_FIELDS } from './fbFragments';

export const GET_POST = gql`
  query FacebookGetPost($erxesApiId: String) {
    facebookGetPost(erxesApiId: $erxesApiId) {
      _id
      ...CommonPostAndCommentFields
    }
  }
  ${COMMON_POST_AND_COMMENT_FIELDS}
`;
