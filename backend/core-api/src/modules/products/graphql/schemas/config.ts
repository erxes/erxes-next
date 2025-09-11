export const types = `
  type ProductsConfig @key(fields: "_id") @cacheControl(maxAge: 3) {
    _id: ID!
    code: String!
    value: JSON
  }
`;

export const queries = `
  productsConfigs: [ProductsConfig]
`;

export const mutations = `
  productsConfigsUpdate(configsMap: JSON!): JSON
`;
