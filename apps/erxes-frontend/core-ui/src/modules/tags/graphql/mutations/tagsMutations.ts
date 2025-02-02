import { gql } from '@apollo/client';

export const tagsAdd = gql`
  mutation TagsAdd(
    $name: String!
    $type: String!
    $colorCode: String
    $parentId: String
  ) {
    tagsAdd(
      name: $name
      type: $type
      colorCode: $colorCode
      parentId: $parentId
    ) {
      _id
    }
  }
`;
