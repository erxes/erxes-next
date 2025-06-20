export const TypeExtensions = `
  extend type User @key(fields: "_id") {
    _id: String @external,
    conversations: [Conversation]
  }

  extend type Branch @key(fields: "_id") {
    _id: String @external
  }

  extend type Department @key(fields: "_id") {
    _id: String @external
  }

  extend type Company @key(fields: "_id") {
    _id: String @external
  }

  extend type Customer @key(fields: "_id") {
    _id: String @external
    conversations: [Conversation]
  }

  extend type Tag @key(fields: "_id") {
    _id: String @external
  }

  extend type Brand @key(fields: "_id") {
    _id: String @external
  }
`;
