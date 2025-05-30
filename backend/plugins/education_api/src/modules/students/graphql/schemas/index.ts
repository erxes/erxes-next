import {
  mutations as StudentMutations,
  queries as StudentQueries,
  types as StudentTypes,
} from './students';

export const types = `
  ${StudentTypes}
`;

export const queries = `
  ${StudentQueries}
`;

export const mutations = `
  ${StudentMutations}
`;
