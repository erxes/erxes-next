import gql from 'graphql-tag';

const COMMON_USER_FIELDS = `
      _id
      username
      email
      details {
        fullName
        avatar
        shortName
        firstName
        middleName
        lastName
      }
`;

const automationConstants = `
  query automationConstants {
    automationConstants
  }
`;

const detail = gql`
query AutomationDetail($id: String!) {
  automationDetail(_id: $id) {
    _id
    name
    status
    createdAt
    updatedAt
    createdBy
    updatedBy
    triggers {
      id
      type
      style
      config
      icon
      label
      description
      position
      workflowId
      actionId
      isCustom
      count
    }
    actions {
      id
      type
      style
      config
      icon
      label
      description
      position
      workflowId
      nextActionId
    }
    createdUser {
      ${COMMON_USER_FIELDS}
    }
    updatedUser {
      ${COMMON_USER_FIELDS}
    }
  }
}
`;

const mainList = gql`
query AutomationsMain($page: Int, $perPage: Int, $ids: [String], $excludeIds: Boolean, $searchValue: String, $sortField: String, $sortDirection: Int, $status: String, $tagIds: [String]) {
  automationsMain(page: $page, perPage: $perPage, ids: $ids, excludeIds: $excludeIds, searchValue: $searchValue, sortField: $sortField, sortDirection: $sortDirection, status: $status, tagIds: $tagIds) {
    list {
      _id
      name
      status
      createdAt
      updatedAt
      createdBy
      updatedBy
      createdUser {
        ${COMMON_USER_FIELDS}
      }
      updatedUser {
        ${COMMON_USER_FIELDS}
      }
    }
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
`;

export default { automationConstants, detail, mainList };
