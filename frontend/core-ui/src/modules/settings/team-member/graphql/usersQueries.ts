import { gql } from '@apollo/client';

const GET_USER = gql`
  query userDetail($_id: String) {
    userDetail(_id: $_id) {
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
  }
`;

const GET_USERS_QUERY = gql`
  query Users(
    $limit: Int
    $cursor: String
    $direction: CURSOR_DIRECTION
    $searchValue: String
    $brandIds: [String]
    $departmentId: String
    $branchId: String
    $branchIds: [String]
    $departmentIds: [String]
    $unitId: String
    $segment: String
  ) {
    users(
      limit: $limit
      cursor: $cursor
      direction: $direction
      searchValue: $searchValue
      brandIds: $brandIds
      departmentId: $departmentId
      branchId: $branchId
      branchIds: $branchIds
      departmentIds: $departmentIds
      unitId: $unitId
      segment: $segment
    ) {
      list {
        _id
        branchIds
        branches {
          _id
          code
          title
        }
        brandIds
        details {
          avatar
          birthDate
          coverPhoto
          description
          employeeId
          firstName
          fullName
          lastName
          location
          middleName
          operatorPhone
          position
          shortName
          workStartedDate
        }
        department {
          _id
          code
          title
        }
        departmentIds
        departments {
          _id
          code
          title
        }
        email
        employeeId
        isActive
        isSubscribed
        organizations {
          name
          subdomain
        }
        positionIds
        positions {
          _id
          code
          title
        }
        status
        username
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
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
      userCount
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
      userCount
    }
  }
`;

const GET_SEGMENTS_QUERY = gql`
  query segments($contentTypes: [String]!, $config: JSON) {
    segments(contentTypes: $contentTypes, config: $config) {
      _id
      contentType
      name
      description
      subOf
      color
      conditions
      conditionsConjunction
      shouldWriteActivityLog
      config
      getSubSegments {
        _id
        contentType
        name
        description
        subOf
        color
        conditions
        conditionsConjunction
        shouldWriteActivityLog
        config
      }
    }
  }
`;

const GET_USER_COUNT_BY_OPTION_QUERY = gql`
  query usersTotalCount(
    $departmentId: String
    $unitId: String
    $branchId: String
    $departmentIds: [String]
    $branchIds: [String]
  ) {
    usersTotalCount(
      departmentId: $departmentId
      unitId: $unitId
      branchId: $branchId
      departmentIds: $departmentIds
      branchIds: $branchIds
    )
  }
`;

const queries = {
  GET_BRANCHES_QUERY,
  GET_DEPARTMENTS_QUERY,
  GET_UNITS_QUERY,
  GET_USERS_GROUPS_QUERY,
  GET_USERS_QUERY,
  GET_SEGMENTS_QUERY,
  GET_USER_COUNT_BY_OPTION_QUERY,
  GET_USER,
};

export default queries;
