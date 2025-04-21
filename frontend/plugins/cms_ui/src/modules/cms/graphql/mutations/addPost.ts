import { gql } from '@apollo/client';

export const CMS_POST_ADD = gql`
  mutation PostsAdd($input: PostInput!) {
    cmsPostsAdd(input: $input) {
      _id
      __typename
    }
  }
`;
