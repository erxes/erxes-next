import { authMutations } from '@/auth/graphql/resolvers/mutations';
import { contactMutations } from '@/contacts/graphql/resolvers/mutations';
import { userMutations } from '@/organization/team-member/graphql/mutations';
import { productMutations } from '@/products/graphql/resolvers/mutations';
import { configMutations } from '@/settings/graphql/mutations';
import { tagMutations } from '@/tags/graphql/mutations';
import { appMutations } from '@/apps/graphql/mutations';
<<<<<<< HEAD
import { segmentMutations } from '@/segments/apollo/resolvers/mutations';
=======
import conformityMutations from '@/conformities/graphql/mutations';
import { relationsMutations } from '@/relations/graphql/mutations';
>>>>>>> ef4e23ea5f9913af17c83d142489022de3df55d7

export const mutations = {
  ...contactMutations,
  ...authMutations,
  ...userMutations,
  ...configMutations,
  ...tagMutations,
  ...productMutations,
  ...appMutations,
<<<<<<< HEAD
  ...segmentMutations,
=======
  ...conformityMutations,
  ...relationsMutations,
>>>>>>> ef4e23ea5f9913af17c83d142489022de3df55d7
};
