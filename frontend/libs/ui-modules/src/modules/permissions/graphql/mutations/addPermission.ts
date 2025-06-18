import { gql } from '@apollo/client';

export const ADD_PERMISSIONS = gql`
  mutation PermissionsAdd(
    $module: String!
    $actions: [String!]!
    $userIds: [String!]
    $groupIds: [String!]
  ) {
    permissionsAdd(
      module: $module
      actions: $actions
      userIds: $userIds
      groupIds: $groupIds
    ) {
      _id
      module
      action
      allowed
      groupId
      userId
    }
  }
`;
