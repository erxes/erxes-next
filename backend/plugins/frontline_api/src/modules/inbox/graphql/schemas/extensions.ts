export const TypeExtensions = `
  extend type User @key(fields: "_id") {
    _id: ID @external
    conversations: [Conversation]
  }
`;
