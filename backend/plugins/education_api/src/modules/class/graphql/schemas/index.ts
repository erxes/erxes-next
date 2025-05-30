import {
  mutations as ClassMutations,
  queries as ClassQueries,
  types as ClassTypes,
} from './class';

export const types = `
  ${ClassTypes}
`;

export const queries = `
  ${ClassQueries}
`;

export const mutations = `
  ${ClassMutations}
`;
