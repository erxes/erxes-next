import { gql } from '@apollo/client';

export const CUSTOMER_DETAIL = gql`
  query CustomerDetail($_id: String!) {
    customerDetail(_id: $_id) {
      _id
      avatar
      firstName
      lastName
      middleName
      description
      position
      department
      leadStatus
      sex
      email
      emailValidationStatus
      emails
      getTags {
        _id
      }
      ownerId
      phone
      phoneValidationStatus
      phones
      primaryEmail
      primaryPhone
      score
      code
    }
  }
`;
