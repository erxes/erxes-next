
export const types = `

`;

export const queries = `
  facebookGetAccounts(kind: String): JSON
  facebookGetPages(accountId: String! kind: String!): JSON

`;



export const mutations = `
  facebookUpdateConfigs(configsMap: JSON!): JSON
  facebookRepair(_id: String!): JSON
`;
