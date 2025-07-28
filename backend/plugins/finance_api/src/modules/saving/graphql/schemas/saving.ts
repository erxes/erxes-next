export const types = `
  type Saving {
    _id: String
    name: String
    description: String
  }
`;

export const queries = `
  getSaving(_id: String!): Saving
  getSavings: [Saving]
`;

export const mutations = `
  createSaving(name: String!): Saving
  updateSaving(_id: String!, name: String!): Saving
  removeSaving(_id: String!): Saving
`;
