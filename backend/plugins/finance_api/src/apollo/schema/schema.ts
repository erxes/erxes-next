import { TypeExtensions } from '~/apollo/schema/extention';

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

import {
  mutations as blockMutations,
  queries as blockQueries,
  types as blockTypes,
} from '~/modules/saving/graphql/schemas/block';

import {
  mutations as periodLockMutations,
  queries as periodLockQueries,
  types as periodLockTypes,
} from '~/modules/saving/graphql/schemas/periodLock';

export const types = `
  ${TypeExtensions},
  ${contractTypes},
  ${SavingTypes},
  ${contractTypeTypes},
  ${transactionTypes},
  ${blockTypes},
  ${periodLockTypes}
`;

export const queries = `
  ${SavingQueries},
  ${contractTypeQueries},
  ${contractQueries},
  ${transactionQueries},
  ${blockQueries},
  ${periodLockQueries}
`;

export const mutations = `
  ${SavingMutations},
  ${contractTypeMutations},
  ${contractMutations},
  ${transactionMutations},
  ${blockMutations},
  ${periodLockMutations}
`;

export default { types, queries, mutations };
