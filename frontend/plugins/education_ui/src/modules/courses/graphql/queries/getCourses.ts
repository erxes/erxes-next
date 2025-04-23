import { gql } from '@apollo/client';

export const GET_COURSES = gql`
  query Courses(
    $page: Int
    $perPage: Int
    $categoryId: String
    $ids: [String]
    $searchValue: String
    $sortField: String
    $sortDirection: Int
    $statuses: [String]
  ) {
    courses(
      page: $page
      perPage: $perPage
      categoryId: $categoryId
      ids: $ids
      searchValue: $searchValue
      sortField: $sortField
      sortDirection: $sortDirection
      statuses: $statuses
    ) {
      totalCount
      list {
        _id
        attachment {
          duration
          name
          size
          type
          url
        }
        categoryId
        code
        commentCount
        createdAt
        deadline
        description
        endDate
        name
        startDate
        status
        type
        unitPrice
      }
    }
  }
`;
