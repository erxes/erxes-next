import { gql } from '@apollo/client';

const DEPARTMENTS_FIELDS = `
  _id
  title
  code
  parentId
  order
  userCount
`;

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
      ${DEPARTMENTS_FIELDS}
    }
  }
`;

export const GET_DEPARTMENTS_MAIN = gql`
  query departmentsMain(
    $ids: [String]
    $excludeIds: Boolean,
    $perPage: Int,
    $page: Int
    $searchValue: String,
    $status:String,
    $withoutUserFilter: Boolean
  ){
    departmentsMain(
      ids: $ids
      excludeIds: $excludeIds,
      perPage: $perPage,
      page: $page
      searchValue: $searchValue
      status: $status
      withoutUserFilter: $withoutUserFilter
    ){
      totalCount
      totalUsersCount
      list {
        ${DEPARTMENTS_FIELDS}
      }
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
