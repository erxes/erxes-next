import { TypeExtensions } from '~/apollo/schema/extension';
import {
  mutations as TasksMutations,
  queries as TasksQueries,
  types as TasksTypes,
} from '~/modules/tasks/graphql/schemas';

export const types = `
  ${TypeExtensions}
  ${TasksTypes}
`;

export const queries = `
  ${TasksQueries}
`;

export const mutations = `
  ${TasksMutations}
`;

export default { types, queries, mutations };
