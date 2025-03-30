import {
  mutations as CustomerMutations,
  queries as CustomerQueries,
  types as CustomerTypes,
} from '../../modules/contacts/graphql/schemas/customer';

import {
  mutations as CompanyMutations,
  queries as CompanyQueries,
  types as CompanyTypes,
} from '../../modules/contacts/graphql/schemas/company';

import {
  mutations as AuthMutations,
  queries as AuthQueries,
} from '../../modules/auth/graphql/schemas/auth';

import {
  BranchTypes,
  BrandTypes,
  DepartmentTypes,
  PositionTypes,
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

import {
  mutations as TagMutations,
  queries as TagQueries,
  types as TagTypes,
} from '../../modules/tags/graphql/schemas';

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
    ${CompanyTypes}
    ${DepartmentTypes}
    ${BranchTypes}
    ${PositionTypes}
    ${CommonTypes}
    ${UserTypes}
    ${BrandTypes}
    ${ConfigTypes}
    ${TagTypes}
  `;

export const queries = `
    ${CustomerQueries}
    ${CompanyQueries}
    ${AuthQueries}
    ${UserQueries}
    ${ConfigsQueries}
    ${TagQueries}
  `;

export const mutations = `
    ${CustomerMutations}
    ${CompanyMutations}
    ${AuthMutations}
    ${UserMutations}
    ${ConfigsMutations}
    ${TagMutations}
  `;

export default { types, queries, mutations };
