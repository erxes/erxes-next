import { gql } from '@apollo/client';

const GET_DEPARTMENTS_LIST = gql`
  query Departments(
    $ids: [String]
    $excludeIds: Boolean
    $searchValue: String
    $status: String
    $onlyFirstLevel: Boolean
    $parentId: String
    $sortField: String
    $limit: Int
    $cursor: String
    $direction: CURSOR_DIRECTION
    $withoutUserFilter: Boolean
  ) {
    departments(
      ids: $ids
      excludeIds: $excludeIds
      searchValue: $searchValue
      status: $status
      onlyFirstLevel: $onlyFirstLevel
      parentId: $parentId
      sortField: $sortField
      limit: $limit
      cursor: $cursor
      direction: $direction
      withoutUserFilter: $withoutUserFilter
    ) {
      _id
      code
      title
      supervisorId
      userCount
    }
  }
`;

export { GET_DEPARTMENTS_LIST };
