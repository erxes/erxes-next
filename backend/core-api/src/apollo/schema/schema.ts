import {
  mutations as CustomerMutations,
  queries as CustomerQueries,
  types as CustomerTypes,
} from '../../modules/contacts/graphql/schemas/customer';
import {
  mutations as AuthMutations,
  types as AuthTypes,
} from '../../modules/auth/graphql/schemas/auth';

import {
  DepartmentTypes,
  BranchTypes,
  PositionTypes,
} from '../../modules/structure/graphql/schemas';
import { CommonTypes } from './commonTypes';

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
    ${AuthTypes}
    ${DepartmentTypes}
    ${BranchTypes}
    ${PositionTypes}
    ${CommonTypes}
  `;

export const queries = `
    ${CustomerQueries}
  `;

export const mutations = `
    ${CustomerMutations}
    ${AuthMutations}
  `;

export default { types, queries, mutations };
