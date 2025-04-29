import { courseMutations } from '@/courses/graphql/resolvers/mutations';
import { classMutations } from '@/class/graphql/resolvers/mutations';

export const mutations = {
  ...courseMutations,
  ...classMutations,
};
