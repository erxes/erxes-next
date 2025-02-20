import { gql } from '@apollo/client';

export const CUSTOMERS_EDIT = gql`
  mutation CustomersEdit(
    $_id: String!
    $avatar: String
    $firstName: String
    $lastName: String
    $middleName: String
    $primaryEmail: String
    $emails: [String]
    $primaryPhone: String
    $phones: [String]
    $ownerId: String
    $position: String
    $department: String
    $phoneValidationStatus: String
    $emailValidationStatus: String
    $sex: Int
    $code: String
    $birthDate: Date
    $customFieldsData: JSON
    $description: String
    $links: JSON
    $isSubscribed: String
  ) {
    customersEdit(
      _id: $_id
      avatar: $avatar
      firstName: $firstName
      lastName: $lastName
      middleName: $middleName
      primaryEmail: $primaryEmail
      emails: $emails
      primaryPhone: $primaryPhone
      phones: $phones
      ownerId: $ownerId
      position: $position
      department: $department
      phoneValidationStatus: $phoneValidationStatus
      emailValidationStatus: $emailValidationStatus
      sex: $sex
      code: $code
      birthDate: $birthDate
      customFieldsData: $customFieldsData
      description: $description
      links: $links
      isSubscribed: $isSubscribed
    ) {
      _id
    }
  }
`;
