import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query Users($page: Int, $perPage: Int, $searchValue: String) {
    users(page: $page, perPage: $perPage, searchValue: $searchValue) {
      _id
      details {
        avatar
        fullName
      }
    }
    usersTotalCount(searchValue: $searchValue)
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

export const GET_USER_INLINE_DETAIL = gql`
  query userDetail($_id: String) {
    userDetail(_id: $_id) {
      _id
      username
      email
      status
      details {
        avatar
        fullName
        shortName
        position
        workStartedDate
        firstName
        middleName
        lastName
      }
      employeeId
    }
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
