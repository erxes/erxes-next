const commonFields = `
  name: String
  userGroupId: String
  expireDate: Date    
  allowAllPermission: Boolean
  noExpire: Boolean
`;

export const types = `
  type App {
    _id: ID
    isEnabled: Boolean
    createdAt: Date
    ${commonFields}
    accessToken: String
    refreshToken: String

    userGroupName: String
  }
`;

export const mutations = `
  appsAdd(${commonFields}): App
  appsEdit(_id: ID!, ${commonFields}): App
  appsRemove(_id: ID!): JSON
`;

export const queries = `
  apps: [App]
  appsTotalCount: Int
  appDetail(_id: ID): App
`;
