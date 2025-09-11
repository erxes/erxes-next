const extendTypes = `
  extend type Product @key(fields: "_id") {
    _id: ID! @external
  }

  extend type Branch @key(fields: "_id") {
    _id: ID @external
  }

  extend type Department @key(fields: "_id") {
    _id: ID @external
  }

  extend type User @key(fields: "_id") {
    _id: ID @external
  }

  type AccCustomer {
    _id: ID!
    code: String
    primaryPhone: String
    firstName: String
    primaryEmail: String
    lastName: String
  }
`;

export default extendTypes;

// extend type ProductCategory @key(fields: "_id") {
//   _id: ID! @external
// }

// extend type Uom @key(fields: "_id") {
//   _id: ID! @external
// }
