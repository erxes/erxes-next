import { gql } from '@apollo/client';

export const GET_CUSTOMERS = gql`
  query customersMainSelect($page: Int, $perPage: Int, $searchValue: String) {
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
