import { gql } from '@apollo/client';

const GET_POSITIONS_LIST = gql`
  query Positions(
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
    positions(
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
      parentId
      userCount
      order
      status
    }
  }
`;

export { GET_POSITIONS_LIST };
