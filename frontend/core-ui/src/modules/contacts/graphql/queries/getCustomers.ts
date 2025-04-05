import { gql } from '@apollo/client';

export const GET_CUSTOMERS = gql`
  query customers(
    $page: Int
    $perPage: Int
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
    $sortDirection: Int
    $dateFilters: String
    $segmentData: String
    $emailValidationStatus: String
    $mainType: String
    $mainTypeId: String
    $relType: String
    $isRelated: Boolean
    $isSaved: Boolean
  ) {
    customers(
      page: $page
      perPage: $perPage
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
      sortDirection: $sortDirection
      dateFilters: $dateFilters
      segmentData: $segmentData
      emailValidationStatus: $emailValidationStatus
      conformityMainType: $mainType
      conformityMainTypeId: $mainTypeId
      conformityRelType: $relType
      conformityIsRelated: $isRelated
      conformityIsSaved: $isSaved
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
    }
    customerCounts
  }
`;
