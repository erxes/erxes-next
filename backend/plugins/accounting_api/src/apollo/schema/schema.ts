import { mutations as accountMutations, queries as accountQueries, types as accountTypes } from '../../modules/accounting/graphql/schemas/account';
import {
  mutations as accountingsConfigMutations,
  queries as accountingsConfigQueries,
  types as accountingsConfigTypes,
} from '../../modules/accounting/graphql/schemas/config';
import { mutations as ctaxRowMutations, queries as ctaxRowQueries, types as ctaxRowTypes } from '../../modules/accounting/graphql/schemas/ctaxRow';
import extendTypes from '../../modules/accounting/graphql/schemas/extendTypes';
import { mutations as transactionMutations, queries as transactionQueries, types as transactionTypes } from '../../modules/accounting/graphql/schemas/transactionCommon';
import { mutations as vatRowMutations, queries as vatRowQueries, types as vatRowTypes } from '../../modules/accounting/graphql/schemas/vatRow';

export const types = `
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
