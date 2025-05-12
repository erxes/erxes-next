export const types = `
  type Favorite {
    _id: String!
    type: String!
    item: String!
  }
`;

export const queries = `
  getFavoritesByCurrentUser: [Favorite]
  isFavorite(type: String!, item: String!): Boolean
`;

export const mutations = `
  toggleFavorite(type: String!, item: String!): Favorite
`;
