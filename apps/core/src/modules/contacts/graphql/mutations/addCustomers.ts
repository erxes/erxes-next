import { gql } from "@apollo/client";

export const ADD_CUSTOMERS = gql`mutation customersAdd($state: String, $avatar: String, $firstName: String, $lastName: String, $middleName: String, $sex: Int, $birthDate: Date, $primaryEmail: String, $primaryPhone: String, $phones: [String], $emails: [String], $ownerId: String, $position: String, $department: String, $leadStatus: String, $hasAuthority: String, $description: String, $isSubscribed: String, $links: JSON, $customFieldsData: JSON, $code: String, $emailValidationStatus: String, $phoneValidationStatus: String) {
  customersAdd(
    avatar: $avatar
    firstName: $firstName
    lastName: $lastName
    middleName: $middleName
    primaryEmail: $primaryEmail
    primaryPhone: $primaryPhone
    ownerId: $ownerId
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