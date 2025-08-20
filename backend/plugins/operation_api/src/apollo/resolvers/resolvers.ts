import { Task } from '@/task/graphql/resolvers/customResolvers/task';
import { Team } from '@/team/graphql/resolvers/customResolvers/team';
import { TeamMember } from '@/team/graphql/resolvers/customResolvers/member';

export const customResolvers = {
  Task,
  Team,
  TeamMember,
};
