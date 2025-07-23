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

export const types = `
  ${SavingTypes},
  ${contractTypeTypes}

`;

export const queries = `
  ${SavingQueries},
  ${contractTypeQueries}
`;

export const mutations = `
  ${SavingMutations},
  ${contractTypeMutations}
`;

export default { types, queries, mutations };
