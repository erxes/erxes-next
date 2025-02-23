import { gql } from '@apollo/client';

export const CUSTOMER_INLINE = gql`
  query CustomerDetail($_id: String!) {
    customerDetail(_id: $_id) {
      firstName
      lastName
      primaryEmail
      primaryPhone
      avatar
    }
  }
`;
