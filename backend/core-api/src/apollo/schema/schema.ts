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
  BrandTypes,
} from '../../modules/organization/structure/graphql/schemas';

import {
  ConfigTypes,
  mutations as ConfigsMutations,
  queries as ConfigsQueries,
} from '../../modules/settings/graphql/schemas';

import {
  mutations as UserMutations,
  queries as UserQueries,
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
    ${BrandTypes}
    ${ConfigTypes}
  `;

export const queries = `
    ${CustomerQueries}
    ${AuthQueries}
    ${UserQueries}
    ${ConfigsQueries}
  `;

export const mutations = `
    ${CustomerMutations}
    ${AuthMutations}
    ${UserMutations}
    ${ConfigsMutations}
  `;

export default { types, queries, mutations };
