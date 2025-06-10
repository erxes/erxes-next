import { carMutations } from '~/modules/module/graphql/resolvers/mutations/carMutations';
import { carCategoryMutations } from '~/modules/module/graphql/resolvers/mutations/categoryMutations';

export const mutations = {
  ...carMutations,
  ...carCategoryMutations,
};
