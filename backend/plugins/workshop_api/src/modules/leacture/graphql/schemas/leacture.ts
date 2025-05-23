export const types = `
  type Leacture {
    _id: String
    name: String
    description: String
  }
`;

export const queries = `
  getLeacture(_id: String!): Leacture
  getLeactures: [Leacture]
`;

export const mutations = `
  createLeacture(name: String!): Leacture
  updateLeacture(_id: String!, name: String!): Leacture
  removeLeacture(_id: String!): Leacture
`;
