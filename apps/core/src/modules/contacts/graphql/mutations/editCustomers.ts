import { gql } from "@apollo/client";

export const EDIT_CUSTOMERS =  gql`mutation customersEdit($_id: String!, $avatar: String, $firstName: String, $lastName: String, $middleName: String, $sex: Int, $birthDate: Date, $primaryEmail: String, $primaryPhone: String, $phones: [String], $emails: [String], $ownerId: String, $position: String, $department: String, $leadStatus: String, $hasAuthority: String, $description: String, $isSubscribed: String, $links: JSON, $customFieldsData: JSON, $code: String, $emailValidationStatus: String, $phoneValidationStatus: String) {
  customersEdit(
    _id: $_id
    avatar: $avatar
    firstName: $firstName
    lastName: $lastName
    middleName: $middleName
    primaryEmail: $primaryEmail
    primaryPhone: $primaryPhone
    phones: $phones
    emails: $emails
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