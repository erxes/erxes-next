import { gql } from '@apollo/client';

export const GET_DEPARTMENTS = gql`
  query departments(
    $ids: [String]
    $excludeIds: Boolean
    $perPage: Int
    $page: Int
    $searchValue: String
    $status: String
    $withoutUserFilter: Boolean
  ) {
    departments(
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

export const GET_DEPARTMENT_BY_ID = gql`
  query DepartmentDetail($id: String!) {
    departmentDetail(_id: $id) {
      _id
      code
      title
      parentId
      order
    }
  }
`;
