import { customerMutations } from '../../modules/contacts/graphql/resolvers/mutations/customer';
import { authMutations } from '../../modules/auth/graphql/resolvers/mutations';
import { userMutations } from '../../modules/organization/team-member/graphql/mutations';
import { configMutations } from '../../modules/settings/graphql/mutations';

export const mutations = {
  ...customerMutations,
  ...authMutations,
  ...userMutations,
  ...configMutations,
};
