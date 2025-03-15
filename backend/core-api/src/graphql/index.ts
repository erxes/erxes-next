import {
  mutations as CustomerMutations,
  queries as CustomerQueries,
  types as CustomerTypes,
} from './schema/customer';
import {
  mutations as FormMutations,
  queries as FormQueries,
  types as FormTypes,
} from './schema/form';

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
  ${FormTypes}
`;

export const queries = `
  ${CustomerQueries}
  ${FormQueries}
`;

export const mutations = `
  ${CustomerMutations}
  ${FormMutations}
`;

export default { types, queries, mutations };
