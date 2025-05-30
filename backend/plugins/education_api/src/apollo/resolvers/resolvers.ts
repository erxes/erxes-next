import courseResolvers from '@/courses/graphql/resolvers/customResolvers';
import commentResolvers from '@/comments/graphql/resolvers/customResolvers';
import teacherResolvers from '@/teachers/graphql/resolvers/customResolvers';
import studentResolvers from '@/students/graphql/resolvers/customResolvers';

export const customResolvers = {
  ...teacherResolvers,
  ...courseResolvers,
  ...commentResolvers,
  ...studentResolvers,
};
