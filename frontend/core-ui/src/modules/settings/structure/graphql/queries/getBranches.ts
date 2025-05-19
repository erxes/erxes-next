import { gql } from '@apollo/client';

const GET_BRANCHES_LIST = gql`
  query Branches(
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
    branchesMain(
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
      list {
        _id
        address
        code
        parentId
        userCount
        title
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;

export { GET_BRANCHES_LIST };
