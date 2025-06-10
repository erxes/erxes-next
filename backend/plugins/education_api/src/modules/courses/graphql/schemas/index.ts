import {
  mutations as CoursesMutations,
  queries as CoursesQueries,
  types as CoursesTypes,
} from './courses';

export const types = `
  ${CoursesTypes}
`;

export const queries = `
  ${CoursesQueries}
`;

export const mutations = `
  ${CoursesMutations}
`;
