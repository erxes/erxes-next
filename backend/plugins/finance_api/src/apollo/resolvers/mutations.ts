import { savingMutations } from '@/saving/graphql/resolvers/mutations/saving';
import contractTypeMutations from '~/modules/saving/graphql/resolvers/mutations/contractTypes';

export const mutations = {
  ...savingMutations,
  ...contractTypeMutations,
};
