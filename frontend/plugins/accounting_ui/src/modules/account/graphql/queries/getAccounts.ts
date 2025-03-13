import { gql } from '@apollo/client';

export const GET_ACCOUNTS = gql`
  query accounts(
    $accountsStatus: String
    $categoryId: String
    $currency: String
    $searchValue: String
    $brand: String
    $ids: [String]
    $excludeIds: Boolean
    $isOutBalance: Boolean
    $branchId: String
    $departmentId: String
    $journals: [String]
    $kind: String
    $code: String
    $name: String
    $page: Int
    $perPage: Int
    $sortField: String
    $sortDirection: Int
  ) {
    accounts(
      status: $accountsStatus
      categoryId: $categoryId
      searchValue: $searchValue
      brand: $brand
      ids: $ids
      excludeIds: $excludeIds
      isOutBalance: $isOutBalance
      branchId: $branchId
      currency: $currency
      departmentId: $departmentId
      journals: $journals
      kind: $kind
      code: $code
      name: $name
      page: $page
      perPage: $perPage
      sortField: $sortField
      sortDirection: $sortDirection
    ) {
      _id
      code
      name
      status
      currency
      kind
      journal
      description
      categoryId
      branchId
      departmentId
      isOutBalance
      parentId
      createdAt
      scopeBrandIds
      category {
        _id
        name
        description
        parentId
        code
        order
        scopeBrandIds
        status
        isRoot
        accountCount
        maskType
        mask
      }
    }
  }
`;
