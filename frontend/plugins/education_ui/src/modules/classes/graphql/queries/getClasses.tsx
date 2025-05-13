import { gql } from '@apollo/client';

export const GET_CLASSES = gql`
  query Classes(
    $page: Int
    $perPage: Int
    $direction: CURSOR_DIRECTION
    $cursor: String
  ) {
    courseClasses(
      page: $page
      perPage: $perPage
      direction: $direction
      cursor: $cursor
    ) {
      list {
        _id
        name
        description
        location
        level
        createdAt
        updatedAt
      }
      totalCount
    }
  }
`;
