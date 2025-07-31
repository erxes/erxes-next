import {
  mutations as TaskMutations,
  queries as TaskQueries,
  types as TaskTypes,
} from '@/task/graphql/schemas/task';

export const types = `
  ${TaskTypes}
`;

export const queries = `
  ${TaskQueries}
`;

export const mutations = `
  ${TaskMutations}
`;

export default { types, queries, mutations };
