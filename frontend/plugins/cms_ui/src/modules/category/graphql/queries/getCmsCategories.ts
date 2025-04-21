import { gql } from '@apollo/client';

export const CMS_CATEGORIES = gql`
  query CmsCategories(
    $clientPortalId: String!
    $searchValue: String
    $status: CategoryStatus
    $page: Int
    $perPage: Int
    $sortField: String
    $sortDirection: String
  ) {
    cmsCategories(
      clientPortalId: $clientPortalId
      searchValue: $searchValue
      status: $status
      page: $page
      perPage: $perPage
      sortField: $sortField
      sortDirection: $sortDirection
    ) {
      _id
      clientPortalId
      createdAt
      description
      name
      slug
      status
      customFieldsData
      parent {
        _id
        name
        slug
        status
        __typename
      }
      parentId
      __typename
    }
  }
`;
