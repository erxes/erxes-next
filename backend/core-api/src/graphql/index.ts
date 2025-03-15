import {
  mutations as CustomerMutations,
  queries as CustomerQueries,
  types as CustomerTypes,
} from './schema/customer';
import {
  mutations as StructureMutations,
  queries as StructureQueries,
  types as StructureTypes,
} from './schema/structure';

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
  ${StructureTypes}
`;

export const queries = `
  ${CustomerQueries}
  ${StructureQueries}
`;

export const mutations = `
  ${CustomerMutations}
  ${StructureMutations}
`;

export default { types, queries, mutations };
