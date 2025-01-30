import { gql } from '@apollo/client';

export const CUSTOMER_DETAIL = gql`query CustomerDetail($id: String!) {
  customerDetail(_id: $id) {
    _id
    avatar
    firstName
    lastName
    middleName
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
  }
}
` 