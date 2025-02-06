import { gql } from '@apollo/client';

export const EDIT_CUSTOMERS = gql`
  mutation CustomersEdit(
    $id: String!
    $avatar: String
    $firstName: String
    $lastName: String
    $middleName: String
    $primaryEmail: String
    $primaryPhone: String
    $ownerId: String
    $position: String
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
      _id: $id
      avatar: $avatar
      firstName: $firstName
      lastName: $lastName
      middleName: $middleName
      primaryEmail: $primaryEmail
      primaryPhone: $primaryPhone
      ownerId: $ownerId
      position: $position
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
