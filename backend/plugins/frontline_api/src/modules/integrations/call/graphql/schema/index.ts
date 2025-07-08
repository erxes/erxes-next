import {
  mutations as CallMutations,
  queries as CallQueries,
  types as CallTypes,
} from './call';

export const types = `
    ${CallTypes},
  `;

export const queries = `
    ${CallQueries}
  `;

export const mutations = `
    ${CallMutations}
  `;
