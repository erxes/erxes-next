import { gql } from '@apollo/client';

export const CMS_TAG_ADD = gql`
  mutation CmsTagsAdd($input: PostTagInput!) {
    cmsTagsAdd(input: $input) {
      _id
    }
  }
`;
