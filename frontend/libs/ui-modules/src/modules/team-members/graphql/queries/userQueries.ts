import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query Users($page: Int, $perPage: Int, $searchValue: String, $ids: [String]) {
    users(
      page: $page
      perPage: $perPage
      searchValue: $searchValue
      ids: $ids
    ) {
      _id
      details {
        avatar
        fullName
      }
    }
    usersTotalCount(searchValue: $searchValue, ids: $ids)
  }
`;

export const GET_USERS_GROUP = gql`
  query usersGroups($page: Int, $perPage: Int) {
    usersGroups(page: $page, perPage: $perPage) {
      _id
      name
      description
      members {
        _id
        details {
          fullName
          avatar
        }
      }
    }
    usersGroupsTotalCount
  }
`;

export const GET_ASSIGNED_MEMBER = gql`
  query AssignedMember($_id: String) {
    userDetail(_id: $_id) {
      details {
        avatar
        fullName
      }
    }
  }
`;
