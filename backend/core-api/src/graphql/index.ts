import {
  CustomerMutations,
  CustomerQueries,
  CustomerTypes,
  TagMutations,
  TagQueries,
  TagTypes,
} from './schema';

export const types = `
  scalar JSON
  scalar Date

  enum CacheControlScope {
    PUBLIC
    PRIVATE
  }
  
  directive @cacheControl(
    maxAge: Int
    scope: CacheControlScope
    inheritMaxAge: Boolean
  ) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION

  ${CustomerTypes}
  ${TagTypes}
`;

export const queries = `
  ${CustomerQueries}
  ${TagQueries}
`;

export const mutations = `
  ${CustomerMutations}
  ${TagMutations}
`;

export default { types, queries, mutations };
