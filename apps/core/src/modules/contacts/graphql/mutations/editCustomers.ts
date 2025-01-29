import { gql } from "@apollo/client";

export const EDIT_CUSTOMERS =  gql`mutation customersEdit($_id: String!, $avatar: String, $firstName: String, $lastName: String, $middleName: String, $primaryEmail: String, $primaryPhone: String, $description: String, $isSubscribed: String, $links: JSON, $code: String, $emailValidationStatus: String, $phoneValidationStatus: String) {
  customersEdit(
    _id: $_id
    avatar: $avatar
    firstName: $firstName
    lastName: $lastName
    middleName: $middleName
    primaryEmail: $primaryEmail
    primaryPhone: $primaryPhone
    description: $description
    isSubscribed: $isSubscribed
    links: $links
    code: $code
    emailValidationStatus: $emailValidationStatus
    phoneValidationStatus: $phoneValidationStatus
  ) {
    _id
  }
}`