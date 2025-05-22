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
import {
  mutations as CommentMutations,
  queries as CommentQueries,
  types as CommentTypes,
} from '@/comments/graphql/schemas/comments';
import {
  mutations as TeacherMutations,
  queries as TeacherQueries,
  types as TeacherTypes,
} from '@/teachers/graphql/schemas/teachers';

export const types = `
  enum CacheControlScope {
    PUBLIC
    PRIVATE
  }

  directive @cacheControl(
    maxAge: Int
    scope: CacheControlScope
    inheritMaxAge: Boolean
  ) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION
  ${CoursesTypes}
  ${ClassTypes}
  ${CommentTypes}
  ${TeacherTypes}
`;

export const queries = `
  ${CoursesQueries}
  ${ClassQueries}
  ${CommentQueries}
  ${TeacherQueries}
`;

export const mutations = `
  ${CoursesMutations}
  ${ClassMutations}
  ${CommentMutations}
  ${TeacherMutations}
`;

export default { types, queries, mutations };
