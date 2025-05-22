export const types = `
  type Ll {
    _id: String
    name: String
  }
`;

export const queries = `
  getLl: Ll
  getLls: [Ll]
`;

export const mutations = `
  createLl(name: String!): Ll
  updateLl(_id: String!, name: String!): Ll
  removeLl(_id: String!): Ll
`;
