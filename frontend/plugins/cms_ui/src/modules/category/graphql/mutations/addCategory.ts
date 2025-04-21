import { gql } from '@apollo/client';

export const CMS_CATEGORY_ADD = gql`
  mutation CmsCategoriesAdd($input: PostCategoryInput!) {
    cmsCategoriesAdd(input: $input) {
      _id
      __typename
    }
  }
`;
