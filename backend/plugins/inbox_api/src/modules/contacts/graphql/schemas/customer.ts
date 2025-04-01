export const types = `
  extend type User @key(fields: "_id") {
    _id: String! @external
    conversation: String
  }
`;
