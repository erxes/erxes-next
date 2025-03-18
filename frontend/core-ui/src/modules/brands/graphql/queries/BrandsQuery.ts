import { gql } from '@apollo/client';

export const BRANDS_QUERY = gql`
  query brands($page: Int, $perPage: Int, $searchValue: String) {
    brands(page: $page, perPage: $perPage, searchValue: $searchValue) {
      _id
      name
      code
    }
    brandsTotalCount
  }
`;
