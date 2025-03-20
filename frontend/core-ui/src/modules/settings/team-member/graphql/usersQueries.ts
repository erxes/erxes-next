import gql from 'graphql-tag';

const GET_USERS_QUERY = gql`
  query users(
    $page: Int
    $perPage: Int
    $status: String
    $excludeIds: Boolean
    $searchValue: String
    $isActive: Boolean
    $ids: [String]
    $brandIds: [String]
    $departmentId: String
    $unitId: String
    $isAssignee: Boolean
    $branchId: String
    $departmentIds: [String]
    $branchIds: [String]
    $segment: String
    $segmentData: String
  ) {
    users(
      page: $page
      perPage: $perPage
      status: $status
      excludeIds: $excludeIds
      searchValue: $searchValue
      isActive: $isActive
      ids: $ids
      brandIds: $brandIds
      departmentId: $departmentId
      unitId: $unitId
      branchId: $branchId
      isAssignee: $isAssignee
      departmentIds: $departmentIds
      branchIds: $branchIds
      segment: $segment
      segmentData: $segmentData
    ) {
      _id
      username
      email
      status
      isActive
      groupIds
      brandIds
      score
      positionIds
      details {
        avatar
        fullName
        shortName
        birthDate
        position
        workStartedDate
        location
        description
        operatorPhone
        firstName
        middleName
        lastName
      }
      links
      employeeId
    }
    usersTotalCount(
      searchValue: $searchValue
      isActive: $isActive
      ids: $ids
      brandIds: $brandIds
      departmentId: $departmentId
      unitId: $unitId
      branchId: $branchId
      isAssignee: $isAssignee
      departmentIds: $departmentIds
      branchIds: $branchIds
      segment: $segment
      segmentData: $segmentData
    )
  }
`;

const GET_USERS_GROUPS_QUERY = gql`
  query usersGroups($page: Int, $perPage: Int) {
    usersGroups(page: $page, perPage: $perPage) {
      _id
      name
      description
      memberIds
      members {
        _id
        isActive
        details {
          fullName
          avatar
        }
      }
      departmentIds
      branchIds
    }
  }
`;

const GET_BRANCHES_QUERY = gql`
  query branches($withoutUserFilter: Boolean) {
    branches(withoutUserFilter: $withoutUserFilter) {
      _id
      title
      code
      parentId
    }
  }
`;

const GET_DEPARTMENTS_QUERY = gql`
  query departments($withoutUserFilter: Boolean) {
    departments(withoutUserFilter: $withoutUserFilter) {
      _id
      title
      code
      parentId
    }
  }
`;

const GET_UNITS_QUERY = gql`
  query units {
    units {
      _id
      title
      code
    }
  }
`;

const queries = {
  GET_BRANCHES_QUERY,
  GET_DEPARTMENTS_QUERY,
  GET_UNITS_QUERY,
  GET_USERS_GROUPS_QUERY,
  GET_USERS_QUERY,
};

export default queries;
