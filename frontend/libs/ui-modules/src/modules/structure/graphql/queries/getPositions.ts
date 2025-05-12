import { gql } from '@apollo/client';

export const GET_POSITIONS_QUERY = gql`
  query Positions(
    $ids: [String]
    $searchValue: String
    $status: String
    $onlyFirstLevel: Boolean
    $parentId: String
    $sortField: String
    $limit: Int
    $direction: CURSOR_DIRECTION
    $cursor: String
  ) {
    positions(
      ids: $ids
      searchValue: $searchValue
      status: $status
      onlyFirstLevel: $onlyFirstLevel
      parentId: $parentId
      sortField: $sortField
      limit: $limit
      direction: $direction
      cursor: $cursor
    ) {
      _id
      children {
        _id
        code
        title
        userCount
      }
      code
      order
      parentId
      status
      title
      userCount
    }
  }
`;

export const GET_POSITION_BY_ID = gql`
  query PositionDetail($id: String) {
    positionDetail(_id: $id) {
      _id
      code
      order
      parentId
      status
      title
      userCount
      children {
        _id
        code
        title
        userCount
      }
    }
  }
`;
