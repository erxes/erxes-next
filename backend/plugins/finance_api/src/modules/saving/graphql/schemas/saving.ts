export const types = `
  type Saving {
    _id: ID
    name: String
    description: String
  }
`;

export const queries = `
  getSaving(_id: ID!): Saving
  getSavings: [Saving]
`;

export const mutations = `
  createSaving(name: String!): Saving
  updateSaving(_id: ID!, name: String!): Saving
  removeSaving(_id: ID!): Saving
`;
