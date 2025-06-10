import { gql } from '@apollo/client';

export const GET_COMMENTS = gql`
  query CourseComments(
    $courseId: String!
    $parentId: String
    $page: Int
    $perPage: Int
    $direction: CURSOR_DIRECTION
    $cursor: String
  ) {
    courseComments(
      courseId: $courseId
      parentId: $parentId
      page: $page
      perPage: $perPage
      direction: $direction
      cursor: $cursor
    ) {
      totalCount
      list {
        _id
        courseId
        parentId
        content
        childCount
        createdAt
        updatedAt
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;
