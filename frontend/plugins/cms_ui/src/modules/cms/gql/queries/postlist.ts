import { gql } from '@apollo/client';

export const POSTS_QUERY = gql`
  query PostList(
    $clientPortalId: String!
    $featured: Boolean
    $categoryId: String
    $searchValue: String
    $status: PostStatus
    $page: Int
    $perPage: Int
    $tagIds: [String]
    $sortField: String
    $sortDirection: String
  ) {
    cmsPostList(
      clientPortalId: $clientPortalId
      featured: $featured
      categoryId: $categoryId
      searchValue: $searchValue
      status: $status
      page: $page
      perPage: $perPage
      tagIds: $tagIds
      sortField: $sortField
      sortDirection: $sortDirection
    ) {
      currentPage
      totalCount
      totalPages
      posts {
        _id
        authorKind
        author {
          ... on User {
            _id
            username
            email
            details {
              fullName
              shortName
              avatar
              firstName
              lastName
              middleName
              __typename
            }
            __typename
          }
          ... on ClientPortalUser {
            _id
            fullName
            firstName
            lastName
            email
            username
            customer {
              avatar
              __typename
            }
            __typename
          }
          __typename
        }
        categoryIds
        categories {
          _id
          name
          __typename
        }
        featured
        status
        tagIds
        tags {
          _id
          name
          __typename
        }
        authorId
        createdAt
        autoArchiveDate
        scheduledDate
        thumbnail {
          url
          __typename
        }
        title
        updatedAt
        __typename
      }
      __typename
    }
  }
`;
