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
  mutations as branchsMutations,
  queries as branchsQueries,
  BranchTypes,
} from '../../modules/organization/structure/graphql/schemas/branch';
import {
  mutations as departmentsMutations,
  queries as departmentsQueries,
  DepartmentTypes,
} from '../../modules/organization/structure/graphql/schemas/department';
import {
  mutations as positionsMutations,
  queries as positionsQueries,
  PositionTypes,
} from '../../modules/organization/structure/graphql/schemas/position';
import {
  mutations as structuresMutations,
  StructureTypes,
} from '../../modules/organization/structure/graphql/schemas/structure';
import {
  mutations as unitsMutations,
  queries as unitsQueries,
  UnitTypes,
} from '../../modules/organization/structure/graphql/schemas/units';

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
  mutations as ProductMutations,
  queries as ProductQueries,
  types as ProductTypes,
} from '../../modules/products/graphql/schemas';

import { CommonTypes } from './commonTypes';
import { BrandTypes } from '../../modules/organization/structure/graphql/schemas/brand';

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
    ${CommonTypes}
    ${UserTypes}
    ${ConfigTypes}
    ${ProductTypes}
    ${BranchTypes}
    ${DepartmentTypes}
    ${PositionTypes}
    ${StructureTypes}
    ${UnitTypes}
    ${BrandTypes}
  `;

export const queries = `
    ${CustomerQueries}
    ${CompanyQueries}
    ${AuthQueries}
    ${UserQueries}
    ${ConfigsQueries}
    ${ProductQueries}
    ${branchsQueries}
    ${departmentsQueries}
    ${positionsQueries}
    ${unitsQueries}
  `;

export const mutations = `
    ${CustomerMutations}
    ${CompanyMutations}
    ${AuthMutations}
    ${UserMutations}
    ${ConfigsMutations}
    ${ProductMutations}
    ${branchsMutations}
    ${departmentsMutations}
    ${positionsMutations}
    ${structuresMutations}
    ${unitsMutations}
  `;

export default { types, queries, mutations };
