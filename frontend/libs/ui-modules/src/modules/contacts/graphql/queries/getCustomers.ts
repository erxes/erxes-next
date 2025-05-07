import { gql } from '@apollo/client';

export const GET_CUSTOMERS = gql`
  query customersMainSelect(
    $searchValue: String
    $limit: Int
    $direction: CURSOR_DIRECTION
  ) {
    customersMain(page: $page, perPage: $perPage, searchValue: $searchValue) {
      list {
        _id
        firstName
        middleName
        lastName
        avatar
        primaryEmail
        primaryPhone
      }
      totalCount
    }
  }
`;
