import { courseMutations } from '@/courses/graphql/resolvers/mutations';
import { classMutations } from '@/class/graphql/resolvers/mutations';
import { commentMutations } from '@/comments/graphql/resolvers/mutations';

export const mutations = {
  ...courseMutations,
  ...classMutations,
  ...commentMutations,
};
