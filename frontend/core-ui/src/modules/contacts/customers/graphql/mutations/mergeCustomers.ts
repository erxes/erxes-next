import { gql } from '@apollo/client';

export const CUSTOMERS_MERGE_MUTATION = gql`
  mutation Mutation($customerIds: [String], $customerFields: JSON) {
    customersMerge(customerIds: $customerIds, customerFields: $customerFields) {
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
      links
      state
      owner {
        _id
        username
      }
      integrationId
      createdAt
      remoteAddress
      location
      customFieldsData
      trackedData
      tagIds
      updatedAt
    }
  }
`;
