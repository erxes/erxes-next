import {
  mutations as TasksMutations,
  queries as TasksQueries,
  types as TasksTypes,
} from '@/tasks/graphql/schemas/tasks';

export const types = `
  ${TasksTypes}
`;

export const queries = `
  ${TasksQueries}
`;

export const mutations = `
  ${TasksMutations}
`;

export default { types, queries, mutations };
