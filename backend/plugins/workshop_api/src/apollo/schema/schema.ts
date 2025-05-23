import {
  mutations as LeactureMutations,
  queries as LeactureQueries,
  types as LeactureTypes,
} from '@/leacture/graphql/schemas/leacture';

export const types = `
  ${LeactureTypes}
`;

export const queries = `
  ${LeactureQueries}
`;

export const mutations = `
  ${LeactureMutations}
`;

export default { types, queries, mutations };
