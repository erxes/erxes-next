import { authMutations } from '../../modules/auth/graphql/resolvers/mutations';
import { contactMutations } from '../../modules/contacts/graphql/resolvers/mutations';
import { userMutations } from '../../modules/organization/team-member/graphql/mutations';
import { productMutations } from '../../modules/products/graphql/resolvers/mutations';
import { configMutations } from '../../modules/settings/graphql/mutations';
import { tagMutations } from '../../modules/tags/graphql/mutations';

export const mutations = {
  ...contactMutations,
  ...authMutations,
  ...userMutations,
  ...configMutations,
  ...tagMutations,
  ...productMutations,
};
