import { gql } from '@apollo/client';

export const TAGS_QUERY = gql`
  query Tags(
    $type: String
    $searchValue: String
    $page: Int
    $perPage: Int
    $parentId: String
    $tagIds: [String]
  ) {
    tags(
      type: $type
      searchValue: $searchValue
      page: $page
      perPage: $perPage
      parentId: $parentId
      tagIds: $tagIds
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

export const TAG_BY_IDS_QUERY = gql`
  query TagsByIds($tagIds: [String]) {
    tags(tagIds: $tagIds) {
      _id
      colorCode
      name
    }
  }
`;
