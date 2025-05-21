import courseResolvers from '@/courses/graphql/resolvers/customResolvers';
import commentResolvers from '@/comments/graphql/resolvers/customResolvers';
import { mutations } from './mutations';
import { queries } from './queries';

export const customResolvers = {
  Mutation: {
    ...mutations,
  },
  Query: {
    ...queries,
  },
  ...courseResolvers,
  ...commentResolvers,
};
