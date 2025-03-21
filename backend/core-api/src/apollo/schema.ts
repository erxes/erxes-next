import {
  mutations as CustomerMutations,
  queries as CustomerQueries,
  types as CustomerTypes,
} from '../modules/contacts/graphql/schema/customer';

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
  `;

export const queries = `
    ${CustomerQueries}
  `;

export const mutations = `
    ${CustomerMutations}
  `;

export default { types, queries, mutations };
