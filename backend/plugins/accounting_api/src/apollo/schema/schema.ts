import { mutations as accountMutations, queries as accountQueries, types as accountTypes } from '@/accounting/graphql/schemas/account';
import {
  mutations as accountingsConfigMutations,
  queries as accountingsConfigQueries,
  types as accountingsConfigTypes,
} from '@/accounting/graphql/schemas/config';
import { mutations as ctaxRowMutations, queries as ctaxRowQueries, types as ctaxRowTypes } from '@/accounting/graphql/schemas/ctaxRow';
import extendTypes from '@/accounting/graphql/schemas/extendTypes';
import { mutations as transactionMutations, queries as transactionQueries, types as transactionTypes } from '@/accounting/graphql/schemas/transactionCommon';
import { mutations as vatRowMutations, queries as vatRowQueries, types as vatRowTypes } from '@/accounting/graphql/schemas/vatRow';

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
  ${extendTypes}
  ${accountTypes()}
  ${vatRowTypes()}
  ${ctaxRowTypes()}
  ${accountingsConfigTypes}
  ${transactionTypes()}
`;

export const queries = `
  ${accountQueries}
  ${accountingsConfigQueries}
  ${vatRowQueries}
  ${ctaxRowQueries}
  ${transactionQueries}
`;

export const mutations = `
  ${accountMutations}
  ${accountingsConfigMutations}
  ${vatRowMutations}
  ${ctaxRowMutations}
  ${transactionMutations}
`;

export default { types, queries, mutations };
