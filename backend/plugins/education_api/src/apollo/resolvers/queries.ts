import { courseQueries } from '@/courses/graphql/resolvers/queries';
import { classQueries } from '@/class/graphql/resolvers/queries';
import { commentQueries } from '@/comments/graphql/resolvers/queries';
import { teacherQueries } from '@/teachers/graphql/resolvers/queries';

export const queries = {
  ...courseQueries,
  ...classQueries,
  ...commentQueries,
  ...teacherQueries,
};
