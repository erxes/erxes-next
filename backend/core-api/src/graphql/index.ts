import {
  mutations as CustomerMutations,
  queries as CustomerQueries,
  types as CustomerTypes,
} from './schema/customer';

import {
  mutations as internalNoteMutations,
  queries as internalNoteQueries,
  types as internalNoteTypes,
} from './schema/internalNote';

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
  ${internalNoteTypes}
`;

export const queries = `
  ${CustomerQueries}
  ${internalNoteQueries}
`;

export const mutations = `
  ${CustomerMutations}
  ${internalNoteMutations}
`;

export default { types, queries, mutations };
