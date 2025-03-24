import {
  mutations as CustomerMutations,
  queries as CustomerQueries,
  types as CustomerTypes,
} from '../../modules/contacts/graphql/schemas/customer';
import {
  mutations as AuthMutations,
  queries as AuthQueries,
} from '../../modules/auth/graphql/schemas/auth';

import {
  DepartmentTypes,
  BranchTypes,
  PositionTypes,
} from '../../modules/structure/graphql/schemas';

import {
  mutations as UserMutations,
  types as UserTypes,
} from '../../modules/organization/team-member/graphql/schema';

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
    ${DepartmentTypes}
    ${BranchTypes}
    ${PositionTypes}
    ${CommonTypes}
    ${UserTypes}
  `;

export const queries = `
    ${CustomerQueries}
    ${AuthQueries}
  `;

export const mutations = `
    ${CustomerMutations}
    ${AuthMutations}
    ${UserMutations}
  `;

export default { types, queries, mutations };
