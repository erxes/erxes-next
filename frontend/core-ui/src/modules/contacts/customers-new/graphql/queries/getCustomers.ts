import { gql } from '@apollo/client';
import {
  GQL_CURSOR_PARAM_DEFS,
  GQL_CURSOR_PARAMS,
  GQL_PAGE_INFO,
} from 'erxes-ui';

export const GET_CUSTOMERS = gql`
  query customers(
    $segment: String
    $tag: String
    $type: String
    $ids: [String]
    $excludeIds: Boolean
    $searchValue: String
    $autoCompletionType: String
    $autoCompletion: Boolean
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
    $mainType: String
    $mainTypeId: String
    $relType: String
    $isRelated: Boolean
    $isSaved: Boolean
    ${GQL_CURSOR_PARAM_DEFS}
  ) {
    customers(
      segment: $segment
      tag: $tag
      type: $type
      ids: $ids
      excludeIds: $excludeIds
      autoCompletionType: $autoCompletionType
      autoCompletion: $autoCompletion
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
      conformityMainType: $mainType
      conformityMainTypeId: $mainTypeId
      conformityRelType: $relType
      conformityIsRelated: $isRelated
      conformityIsSaved: $isSaved
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
