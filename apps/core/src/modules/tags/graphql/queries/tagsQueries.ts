import { gql } from '@apollo/client';

export const tagsQuery = gql`
  query Tags(
    $type: String
    $searchValue: String
    $page: Int
    $perPage: Int
    $parentId: String
  ) {
    tags(
      type: $type
      searchValue: $searchValue
      page: $page
      perPage: $perPage
      parentId: $parentId
    ) {
      _id
      colorCode
      name
      order
      parentId
      totalObjectCount
    }
    tagsQueryCount(type: $type, searchValue: $searchValue)
  }
`;
