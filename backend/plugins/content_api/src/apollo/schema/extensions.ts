export const TypeExtensions = `
    enum CacheControlScope {
      PUBLIC
      PRIVATE
    }
    
    directive @cacheControl(
      maxAge: Int
      scope: CacheControlScope
      inheritMaxAge: Boolean
    ) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION


  extend type User @key(fields: "_id") {
    _id: ID! @external
  }

  extend type Brand @key(fields: "_id") {
    _id: ID! @external
  }

  extend type Customer @key(fields: "_id") {
    _id: ID! @external
  }

  extend type Company @key(fields: "_id") {
    _id: ID! @external
  }

  extend type Tag @key(fields: "_id") {
    _id: ID! @external
  }



`;
