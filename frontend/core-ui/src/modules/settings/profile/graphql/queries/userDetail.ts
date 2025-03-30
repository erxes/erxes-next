import { gql } from '@apollo/client';

export const userDetail = gql`
  query userDetail($_id: String) {
    userDetail(_id: $_id) {
      _id
      username
      email
      isActive
      status
      details {
        avatar
        fullName
        shortName
        description
        firstName
        middleName
        lastName
      }
      links
      getNotificationByEmail
    }
  }
`;
