import { appMutations } from '@/apps/graphql/mutations';
import { authMutations } from '@/auth/graphql/resolvers/mutations';
import conformityMutations from '@/conformities/graphql/mutations';
import { contactMutations } from '@/contacts/graphql/resolvers/mutations';
import { exchangeRateMutations } from '@/exchangeRates/graphql/resolvers/mutations';
import { organizationConfigMutations } from '@/organization/settings/graphql/configs/mutations';
import { favoriteMutations } from '@/organization/settings/graphql/favorites/mutations';
import { structureMutations } from '@/organization/structure/graphql/resolvers/mutations';
import { userMutations } from '@/organization/team-member/graphql/mutations';
import { productMutations } from '@/products/graphql/resolvers/mutations';
import { relationsMutations } from '@/relations/graphql/mutations';
import { segmentMutations } from '@/segments/graphql/resolvers/mutations';
import { tagMutations } from '@/tags/graphql/mutations';
import { permissionMutations } from '~/modules/permissions/graphql/resolvers/mutations/permission';
import { usersGroupMutations } from '~/modules/permissions/graphql/resolvers/mutations/userGroup';

export const mutations = {
  ...contactMutations,
  ...authMutations,
  ...userMutations,
  ...organizationConfigMutations,
  ...tagMutations,
  ...productMutations,
  ...appMutations,
  ...segmentMutations,
  ...conformityMutations,
  ...relationsMutations,
  ...favoriteMutations,
  ...structureMutations,
  ...exchangeRateMutations,
  ...permissionMutations,
  ...usersGroupMutations,
};
