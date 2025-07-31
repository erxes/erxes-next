import { taskQueries } from '@/task/graphql/resolvers/queries/task';
import { projectQueries } from '@/project/graphql/resolvers/queries/project';
import { teamQueries } from '@/team/graphql/resolvers/queries/team';
import { statusQueries } from '@/status/graphql/resolvers/queries/status';

export const queries = {
  ...taskQueries,
  ...projectQueries,
  ...teamQueries,
  ...statusQueries,
};
