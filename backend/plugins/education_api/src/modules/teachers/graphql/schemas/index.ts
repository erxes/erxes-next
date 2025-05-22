import {
  mutations as TeacherMutations,
  queries as TeacherQueries,
  types as TeacherTypes,
} from './teachers';

export const types = `
  ${TeacherTypes}
`;

export const queries = `
  ${TeacherQueries}
`;

export const mutations = `
  ${TeacherMutations}
`;
