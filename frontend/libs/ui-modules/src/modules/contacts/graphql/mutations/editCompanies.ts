import { gql } from '@apollo/client';

export const EDIT_COMPANIES = gql`
  mutation CompaniesEdit(
    $_id: String!
    $avatar: String
    $primaryName: String
    $names: [String]
    $primaryPhone: String
    $phones: [String]
    $phoneValidationStatus: String
    $primaryEmail: String
    $emailValidationStatus: String
    $emails: [String]
    $primaryAddress: JSON
    $size: Int
    $website: String
    $industry: String
    $email: String
    $businessType: String
    $tagIds: [String]
    $ownerId: String
  ) {
    companiesEdit(
      _id: $_id
      avatar: $avatar
      primaryName: $primaryName
      names: $names
      primaryPhone: $primaryPhone
      phoneValidationStatus: $phoneValidationStatus
      phones: $phones
      primaryEmail: $primaryEmail
      emailValidationStatus: $emailValidationStatus
      emails: $emails
      primaryAddress: $primaryAddress
      size: $size
      website: $website
      industry: $industry
      email: $email
      businessType: $businessType
      tagIds: $tagIds
      ownerId: $ownerId
    ) {
      _id
    }
  }
`;
