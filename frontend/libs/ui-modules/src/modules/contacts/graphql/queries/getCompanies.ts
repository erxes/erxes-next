import { gql } from '@apollo/client';

export const GET_COMPANIES = gql`
  query companiesMainSelect($page: Int, $perPage: Int, $searchValue: String) {
    companiesMain(page: $page, perPage: $perPage, searchValue: $searchValue) {
      list {
        _id
        avatar
        primaryName
        names
        primaryEmail
      }
      totalCount
    }
  }
`;
