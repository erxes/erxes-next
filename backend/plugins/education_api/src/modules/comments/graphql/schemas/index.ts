import {
  mutations as CommentMutations,
  queries as CommentQueries,
  types as CommentTypes,
} from './comments';

export const types = `
  ${CommentTypes}
`;

export const queries = `
  ${CommentQueries}
`;

export const mutations = `
  ${CommentMutations}
`;
