import { gql } from "@apollo/client";

export const GET_USERS = gql`
query Users($page: Int, $perPage: Int, $searchValue: String) {
  users(
    page: $page
    perPage: $perPage
    searchValue: $searchValue
  ) {
    _id
    details {
      avatar
      fullName
    }
  }
    usersTotalCount(searchValue: $searchValue)
}`