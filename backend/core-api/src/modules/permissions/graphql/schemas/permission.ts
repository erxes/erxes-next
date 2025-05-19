export const types = `
  type Permission {
    _id: String!
    module: String
    action: String
    userId: String
    groupId: String
    requiredActions: [String]
    allowed: Boolean
    user: User
    group: UsersGroup
  }

  type PermissionAction {
    name: String
    description: String
    module: String
  }

  type PermissionModule {
    name: String
    description: String
    actions: [PermissionAction]
  }

  type PermissionListResponse {
    list: [Permission]
    pageInfo: PageInfo
    totalCount: Int
  }
`;

const queryParams = `
  module: String,
  action: String,
  userId: String,
  groupId: String,
  allowed: Boolean,

  limit: Int
  cursor: String
  direction: CURSOR_DIRECTION
`;

export const queries = `
  permissions(${queryParams}): PermissionListResponse
  permissionModules: [PermissionModule]
  permissionActions: [PermissionAction]
  permissionsTotalCount(${queryParams}): Int
`;

const mutationParams = `
  module: String!,
  actions: [String!]!,
  userIds: [String!],
  groupIds: [String!],
  allowed: Boolean
`;

export const mutations = `
  permissionsAdd(${mutationParams}): [Permission]
  permissionsRemove(ids: [String]!): JSON
  permissionsFix: [String]
`;
