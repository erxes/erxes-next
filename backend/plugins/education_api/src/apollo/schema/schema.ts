import {
  graphqlAttachmentInput,
  graphqlAttachmentType,
} from 'erxes-api-shared/utils';
import {
  mutations as CoursesMutations,
  queries as CoursesQueries,
  types as CoursesTypes,
} from '@/courses/graphql/schemas/courses';
import {
  mutations as ClassMutations,
  queries as ClassQueries,
  types as ClassTypes,
} from '@/class/graphql/schemas/class';

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
  ${ClassTypes}
`;

export const queries = `
  ${CoursesQueries}
  ${ClassQueries}
`;

export const mutations = `
  ${CoursesMutations}
  ${ClassMutations}
`;

export default { types, queries, mutations };
