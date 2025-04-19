import { gql } from '@apollo/client';

export const GET_UNITS_MAIN = gql`
  query unitsMain($perPage: Int, $page: Int, $searchValue: String) {
    unitsMain(perPage: $perPage, page: $page, searchValue: $searchValue) {
      list {
        _id
        title
        code
        userCount
      }
      totalCount
      totalUsersCount
    }
  }
`;

export const GET_UNIT_BT_ID = gql`
  query unitDetail($_id: String!) {
    unitDetail(_id: $_id) {
      _id
      title
      code
    }
  }
`;
