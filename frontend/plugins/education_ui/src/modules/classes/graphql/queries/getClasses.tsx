import { gql } from '@apollo/client';

export const GET_CLASSES = gql`
  query Classes($page: Int, $perPage: Int) {
    courseClasses(page: $page, perPage: $perPage) {
      list {
        _id
        courseId
        students {
          _id
        }
        dates
        startTime
        endTime
        limit
        entries
        createdAt
        updatedAt
      }
      totalCount
    }
  }
`;
