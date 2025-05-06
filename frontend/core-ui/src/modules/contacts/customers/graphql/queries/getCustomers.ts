import { gql } from '@apollo/client';
import {
  GQL_CURSOR_PARAM_DEFS,
  GQL_CURSOR_PARAMS,
  GQL_PAGE_INFO,
} from 'erxes-ui';

export const GET_CUSTOMERS = gql`
  query customers(
    $segment: String
    $tags: [String]
    $type: String
    $searchValue: String
    $brand: String
    $integration: String
    $form: String
    $startDate: String
    $endDate: String
    $leadStatus: String
    $sortField: String
    $dateFilters: String
    $segmentData: String
    $emailValidationStatus: String
    ${GQL_CURSOR_PARAM_DEFS}
  ) {
    customers(
      segment: $segment
      tags: $tags
      type: $type
      searchValue: $searchValue
      brand: $brand
      integration: $integration
      form: $form
      startDate: $startDate
      endDate: $endDate
      leadStatus: $leadStatus
      sortField: $sortField
      dateFilters: $dateFilters
      segmentData: $segmentData
      emailValidationStatus: $emailValidationStatus
      ${GQL_CURSOR_PARAMS}
    ) {
      list {
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
        links
        state
        ownerId
        integrationId
        createdAt
        remoteAddress
        location
        customFieldsData
        trackedData
        tagIds
      }
      ${GQL_PAGE_INFO}
    }
  }
`;
