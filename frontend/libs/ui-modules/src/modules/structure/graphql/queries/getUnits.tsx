import { gql } from '@apollo/client';

export const GET_UNITS_MAIN = gql`
  query unitsMain($searchValue: String) {
    units(searchValue: $searchValue) {
      _id
      title
      code
      userCount
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
