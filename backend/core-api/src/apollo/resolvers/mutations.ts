import { authMutations } from '@/auth/graphql/resolvers/mutations';
import { contactMutations } from '@/contacts/graphql/resolvers/mutations';
import { userMutations } from '@/organization/team-member/graphql/mutations';
import { productMutations } from '@/products/graphql/resolvers/mutations';
import { configMutations } from '@/settings/graphql/mutations';
import { tagMutations } from '@/tags/graphql/mutations';

export const mutations = {
  ...contactMutations,
  ...authMutations,
  ...userMutations,
  ...configMutations,
  ...tagMutations,
  ...productMutations,
};
