import { gql } from '@apollo/client';

export const GET_COMPANIES = gql`
  query companiesMain(
    $page: Int
    $perPage: Int
    $segment: String
    $tag: String
    $ids: [String]
    $excludeIds: Boolean
    $searchValue: String
    $autoCompletion: Boolean
    $autoCompletionType: String
    $brand: String
    $sortField: String
    $sortDirection: Int
    $dateFilters: String
    $segmentData: String
    $mainType: String
    $mainTypeId: String
    $relType: String
    $isRelated: Boolean
    $isSaved: Boolean
  ) {
    companiesMain(
      page: $page
      perPage: $perPage
      segment: $segment
      tag: $tag
      ids: $ids
      excludeIds: $excludeIds
      searchValue: $searchValue
      autoCompletion: $autoCompletion
      autoCompletionType: $autoCompletionType
      brand: $brand
      sortField: $sortField
      sortDirection: $sortDirection
      dateFilters: $dateFilters
      segmentData: $segmentData
      conformityMainType: $mainType
      conformityMainTypeId: $mainTypeId
      conformityRelType: $relType
      conformityIsRelated: $isRelated
      conformityIsSaved: $isSaved
    ) {
      list {
        _id
        avatar
        primaryName
        names
        size
        industry
        plan
        location
        parentCompanyId
        emails
        primaryEmail
        ownerId
        phones
        primaryPhone
        businessType
        links
        owner {
          _id
          details {
            fullName
          }
        }
        tagIds
        getTags {
          _id
          name
          colorCode
        }
        score
      }
      totalCount
    }
  }
`;
