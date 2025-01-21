import { gql } from "@apollo/client";

export const ADD_CUSTOMERS = gql`mutation customersAdd($state: String, $avatar: String, $firstName: String, $lastName: String, $middleName: String, $sex: Int, $birthDate: Date, $primaryEmail: String, $primaryPhone: String, $phones: [String], $emails: [String], $ownerId: String, $position: String, $department: String, $leadStatus: String, $hasAuthority: String, $description: String, $isSubscribed: String, $links: JSON, $customFieldsData: JSON, $code: String, $emailValidationStatus: String, $phoneValidationStatus: String) {
  customersAdd(
    state: $state
    avatar: $avatar
    firstName: $firstName
    lastName: $lastName
    middleName: $middleName
    sex: $sex
    birthDate: $birthDate
    primaryEmail: $primaryEmail
    primaryPhone: $primaryPhone
    phones: $phones
    emails: $emails
    ownerId: $ownerId
    position: $position
    department: $department
    leadStatus: $leadStatus
    hasAuthority: $hasAuthority
    description: $description
    isSubscribed: $isSubscribed
    links: $links
    customFieldsData: $customFieldsData
    code: $code
    emailValidationStatus: $emailValidationStatus
    phoneValidationStatus: $phoneValidationStatus
  ) {
    _id
    firstName
    middleName
    lastName
    avatar
    sex
    birthDate
    primaryEmail
    emails
    primaryPhone
    phones
    state
    visitorContactInfo
    modifiedAt
    position
    department
    leadStatus
    hasAuthority
    description
    isSubscribed
    code
    emailValidationStatus
    phoneValidationStatus
    score
    isOnline
    lastSeenAt
    sessionCount
    links
    ownerId
    owner {
      _id
      details {
        fullName
        __typename
      }
      __typename
    }
    integrationId
    createdAt
    remoteAddress
    location
    customFieldsData
    trackedData
    tagIds
    getTags {
      _id
      name
      colorCode
      __typename
    }
    __typename
  }
}`