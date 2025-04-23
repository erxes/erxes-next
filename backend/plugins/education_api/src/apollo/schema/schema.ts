import {
  graphqlAttachmentInput,
  graphqlAttachmentType,
} from 'erxes-api-shared/utils';
import {
  mutations as CoursesMutations,
  queries as CoursesQueries,
  types as CoursesTypes,
} from '@/courses/graphql/schemas/courses';

export const types = `
  scalar JSON
  scalar Date

  enum CacheControlScope {
    PUBLIC
    PRIVATE
  }

  directive @cacheControl(
    maxAge: Int
    scope: CacheControlScope
    inheritMaxAge: Boolean
  ) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION
   
  ${graphqlAttachmentType}
  ${graphqlAttachmentInput}
  ${CoursesTypes}
`;

export const queries = `
  ${CoursesQueries}
`;

export const mutations = `
  ${CoursesMutations}
`;

export default { types, queries, mutations };
