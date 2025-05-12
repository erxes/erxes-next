import { authMutations } from '@/auth/graphql/resolvers/mutations';
import { contactMutations } from '@/contacts/graphql/resolvers/mutations';
import { userMutations } from '@/organization/team-member/graphql/mutations';
import { productMutations } from '@/products/graphql/resolvers/mutations';
import { configMutations } from '@/organization/settings/graphql/configs/mutations';
import { tagMutations } from '@/tags/graphql/mutations';
import { appMutations } from '@/apps/graphql/mutations';
import conformityMutations from '@/conformities/graphql/mutations';
import { relationsMutations } from '@/relations/graphql/mutations';
import { favoriteMutations } from '@/organization/settings/graphql/favorites/mutations';

export const mutations = {
  ...contactMutations,
  ...authMutations,
  ...userMutations,
  ...configMutations,
  ...tagMutations,
  ...productMutations,
  ...appMutations,
  ...conformityMutations,
  ...relationsMutations,
  ...favoriteMutations,
};
