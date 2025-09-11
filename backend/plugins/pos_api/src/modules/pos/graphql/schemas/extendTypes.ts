const extendTypes = `
  extend type User @key(fields: "_id") {
    _id: ID @external
  }

  extend type ProductCategory @key(fields: "_id") {
    _id: ID @external
  }
`;

export default extendTypes;
