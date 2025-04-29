import { courseQueries } from '@/courses/graphql/resolvers/queries';
import { classQueries } from '@/class/graphql/resolvers/queries';

export const queries = {
  ...courseQueries,
  ...classQueries,
};
