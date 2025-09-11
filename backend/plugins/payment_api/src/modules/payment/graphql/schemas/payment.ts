export const types = `
  type Payment {
    _id: ID!
    name: String!
    kind: String!
    status: String
    config: JSON
    createdAt: Date
  }

  type paymentsTotalCount {
    byKind: JSON
    byStatus: JSON
    total: Int
  }

  type PaymentPublic {
    _id: ID
    name: String
    kind: String
  }
`;

export const inputs = `
  input PaymentInput {
    name: String!
    kind: String!
    status: String
    config: JSON
  }
`;

export const queries = `
  payments(status: String, kind: String): [Payment]

  paymentsPublic(kind: String, _ids:[String], currency: String): [PaymentPublic]
  paymentsCountByType: paymentsTotalCount
  paymentsTotalCount(kind: String, status: String): paymentsTotalCount

  qpayGetMerchant(_id: ID!): JSON
  qpayGetDistricts(cityCode: String!): JSON

  paymentsGetStripeKey(_id: ID!): String
`;

export const mutations = `
  paymentAdd(input: PaymentInput!): Payment
  paymentEdit(_id: ID!, input: PaymentInput!): Payment
  paymentRemove(_id: ID!): String
`;
