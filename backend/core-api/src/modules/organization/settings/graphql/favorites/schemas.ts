export const types = `
  type Favorite {
    _id: String!
    type: String!
    item: String!
  }
`;

export const queries = `
  getFavoritesByUserId(userId: String!): [Favorite]
`;

export const mutations = `
  toggleFavorite(type: String!, item: String!, userId: String!): Favorite
`;
