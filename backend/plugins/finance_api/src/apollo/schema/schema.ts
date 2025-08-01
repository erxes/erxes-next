import {
  mutations as SavingMutations,
  queries as SavingQueries,
  types as SavingTypes,
} from '@/saving/graphql/schemas/saving';
import {
  mutations as contractTypeMutations,
  queries as contractTypeQueries,
  types as contractTypeTypes,
} from '~/modules/saving/graphql/schemas/contractType';

import {
  mutations as transactionMutations,
  queries as transactionQueries,
  types as transactionTypes,
} from '~/modules/saving/graphql/schemas/transaction';

import {
  mutations as contractMutations,
  queries as contractQueries,
  types as contractTypes,
} from '~/modules/saving/graphql/schemas/contract';

import { TypeExtensions } from '~/apollo/schema/extention';

export const types = `
  ${TypeExtensions},
  ${contractTypes},
  ${SavingTypes},
  ${contractTypeTypes},
  ${transactionTypes}
`;

export const queries = `
  ${SavingQueries},
  ${contractTypeQueries},
  ${contractQueries},
  ${transactionQueries},
`;

export const mutations = `
  ${SavingMutations},
  ${contractTypeMutations},
  ${contractMutations},
  ${transactionMutations}
`;

export default { types, queries, mutations };
