import { customerMutations } from '../../modules/contacts/graphql/resolvers/mutations/customer';
import { authMutations } from '../../modules/auth/graphql/resolvers/mutations';

export const mutations = {
  ...customerMutations,
  ...authMutations,
};
