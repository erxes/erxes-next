import { gql } from '@apollo/client';

export const GET_BRANCHES = gql`
  query branches(
    $ids: [String]
    $excludeIds: Boolean
    $perPage: Int
    $page: Int
    $searchValue: String
    $status: String
    $withoutUserFilter: Boolean
  ) {
    branches(
      ids: $ids
      excludeIds: $excludeIds
      perPage: $perPage
      page: $page
      searchValue: $searchValue
      status: $status
      withoutUserFilter: $withoutUserFilter
    ) {
      _id
      code
      title
      parentId
      order
    }
  }
`;

export const GET_BRANCH_BY_ID = gql`
  query BranchDetail($id: String!) {
    branchDetail(_id: $id) {
      _id
      title
      code
      order
    }
  }
`;

export const GET_BRANCHES_MAIN = gql`
  query BranchesMain(
    $ids: [String]
    $excludeIds: Boolean
    $perPage: Int
    $page: Int
    $searchValue: String
    $status: String
    $withoutUserFilter: Boolean
  ) {
    branchesMain(
      ids: $ids
      excludeIds: $excludeIds
      perPage: $perPage
      page: $page
      searchValue: $searchValue
      status: $status
      withoutUserFilter: $withoutUserFilter
    ) {
      list {
        _id
        title
        code
        order
        userCount
      }
      totalCount
      totalUsersCount
    }
  }
`;
