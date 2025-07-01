export const types = `
  type Payment {
    _id: String
    name: String
    description: String
  }
`;

export const queries = `
  getPayment(_id: String!): Payment
  getPayments: [Payment]
`;

export const mutations = `
  createPayment(name: String!): Payment
  updatePayment(_id: String!, name: String!): Payment
  removePayment(_id: String!): Payment
`;
