import { gql } from '@apollo/client';

export const GET_STUDENTS = gql`
  query Students(
    $page: Int
    $perPage: Int
    $direction: CURSOR_DIRECTION
    $cursor: String
  ) {
    students(
      page: $page
      perPage: $perPage
      direction: $direction
      cursor: $cursor
    ) {
      list {
        _id
        username
        email
        details {
          avatar
          coverPhoto
          fullName
          shortName
          birthDate
          position
          workStartedDate
          location
          description
          operatorPhone
          firstName
          middleName
          lastName
          employeeId
        }
        links
        isActive
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;
