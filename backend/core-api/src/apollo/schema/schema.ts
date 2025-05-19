import {
  mutations as CustomerMutations,
  queries as CustomerQueries,
  types as CustomerTypes,
} from '@/contacts/graphql/schemas/customer';

import {
  mutations as CompanyMutations,
  queries as CompanyQueries,
  types as CompanyTypes,
} from '@/contacts/graphql/schemas/company';

import {
  mutations as AuthMutations,
  queries as AuthQueries,
} from '@/auth/graphql/schemas/auth';

import {
  mutations as BrandMutations,
  queries as BrandQueries,
  types as BrandTypes,
} from '@/organization/brand/graphql/schema';

import {
  mutations as branchsMutations,
  queries as branchsQueries,
  BranchTypes,
} from '@/organization/structure/graphql/schemas/branch';

import {
  mutations as departmentsMutations,
  queries as departmentsQueries,
  DepartmentTypes,
} from '@/organization/structure/graphql/schemas/department';

import {
  mutations as structuresMutations,
  queries as structuresQueries,
  StructureTypes,
} from '@/organization/structure/graphql/schemas/structure';

import {
  mutations as unitsMutations,
  queries as unitsQueries,
  UnitTypes,
} from '@/organization/structure/graphql/schemas/units';

import {
  mutations as ConfigsMutations,
  queries as ConfigsQueries,
  ConfigTypes,
} from '~/modules/organization/settings/graphql/configs/schemas';

import {
  mutations as FavoritesMutations,
  queries as FavoritesQueries,
  types as FavoritesTypes,
} from '~/modules/organization/settings/graphql/favorites/schemas';

import {
  mutations as AppMutations,
  queries as AppQueries,
  types as AppTypes,
} from '@/apps/graphql/schemas';

import {
  mutations as positionsMutations,
  queries as positionsQueries,
  PositionTypes,
} from '@/organization/structure/graphql/schemas/position';

import {
  mutations as UserMutations,
  queries as UserQueries,
  types as UserTypes,
} from '@/organization/team-member/graphql/schema';

import {
  mutations as ProductMutations,
  queries as ProductQueries,
  types as ProductTypes,
} from '@/products/graphql/schemas';

import {
  mutations as ExchangeRateMutations,
  queries as ExchangeRateQueries,
  types as ExchangeRateTypes,
} from '~/modules/exchangeRates/graphql/schemas';

import {
  mutations as SegmentMutations,
  queries as SegmentQueries,
  types as SegmentTypes,
} from '~/modules/segments/graphql/schemas';

import { queries as FormQueries } from '~/modules/forms/graphql/schema';

import {
  mutations as RelationMutations,
  queries as RelationQueries,
  types as RelationTypes,
} from '@/relations/graphql/schema';

import {
  mutations as TagMutations,
  queries as TagQueries,
  types as TagTypes,
} from '@/tags/graphql/schemas';

import {
  mutations as ConformityMutations,
  types as ConformityTypes,
} from '@/conformities/graphql/schema';

export const types = `
    enum CacheControlScope {
      PUBLIC
      PRIVATE
    }
    
    directive @cacheControl(
      maxAge: Int
      scope: CacheControlScope
      inheritMaxAge: Boolean
    ) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION
  
    type SomeType {
      visibility: CacheControlScope
    }
    ${CustomerTypes}
    ${CompanyTypes}
    ${UserTypes}
    ${ConfigTypes}
    ${TagTypes}
    ${ProductTypes}
    ${BranchTypes}
    ${DepartmentTypes}
    ${PositionTypes}
    ${StructureTypes}
    ${UnitTypes}
    ${BrandTypes}
    ${AppTypes}
    ${SegmentTypes}
    ${ConformityTypes}
    ${RelationTypes}
    ${FavoritesTypes}
    ${ExchangeRateTypes}
  `;

export const queries = `
    ${CustomerQueries}
    ${CompanyQueries}
    ${AuthQueries}
    ${UserQueries}
    ${ConfigsQueries}
    ${TagQueries}
    ${ProductQueries}
    ${branchsQueries}
    ${departmentsQueries}
    ${positionsQueries}
    ${structuresQueries}
    ${unitsQueries}
    ${BrandQueries}
    ${AppQueries}
    ${FormQueries}
    ${SegmentQueries}
    ${RelationQueries}
    ${FavoritesQueries}
    ${ExchangeRateQueries}
  `;

export const mutations = `
    ${CustomerMutations}
    ${CompanyMutations}
    ${AuthMutations}
    ${UserMutations}
    ${ConfigsMutations}
    ${TagMutations}
    ${ProductMutations}
    ${branchsMutations}
    ${departmentsMutations}
    ${positionsMutations}
    ${structuresMutations}
    ${unitsMutations}
    ${BrandMutations}
    ${AppMutations}
    ${SegmentMutations}
    ${ConformityMutations}
    ${RelationMutations}
    ${FavoritesMutations}
    ${ExchangeRateMutations}
  `;

export default { types, queries, mutations };
