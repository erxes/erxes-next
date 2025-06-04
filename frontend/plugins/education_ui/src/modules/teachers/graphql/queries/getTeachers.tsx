import { gql } from '@apollo/client';

export const GET_TEACHERS = gql`
  query teachers(
    $page: Int
    $perPage: Int
    $cursor: String
    $direction: CURSOR_DIRECTION
  ) {
    teachers(
      page: $page
      perPage: $perPage
      cursor: $cursor
      direction: $direction
    ) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      list {
        _id
        userId
        user {
          _id
          createdAt
          username
          email
          isActive
          details {
            avatar
            fullName
            shortName
            operatorPhone
          }
          employeeId
        }
      }
    }
  }
`;
