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

export default { automationConstants, detail };
