import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  type MenuItem {
    _id: ID!
    parentId: String
    parent: MenuItem
    clientPortalId: String!
    label: String
    contentType: String
    contentTypeID: String
    kind: String
    icon: String
    url: String
    order: Int
    target: String
  }

  type MenuItemResponse {
    list: [MenuItem]
    totalCount: Int
    pageInfo: PageInfo
  }
`;

export const inputs = `
  input MenuItemInput {
    parentId: String
    clientPortalId: String
    label: String
    contentType: String
    contentTypeID: String
    kind: String
    icon: String
    url: String
    order: Int
    target: String
  }
`;

export const queries = `
    cmsMenuList(clientPortalId: String, kind: String, ${GQL_CURSOR_PARAM_DEFS}): MenuItemResponse
    cmsMenu(_id: ID!): MenuItem
`;

export const mutations = `
    cmsAddMenu(input: MenuItemInput!): MenuItem
    cmsEditMenu(_id: ID!, input: MenuItemInput!): MenuItem
    cmsRemoveMenu(_id: ID!): JSON
`;
