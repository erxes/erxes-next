import { appQueries } from '@/apps/graphql/queries';
import { authQueries } from '@/auth/graphql/resolvers/queries';
import { contactQueries } from '@/contacts/graphql/resolvers/queries';
import { documentQueries } from '@/documents/graphql/queries';
import { exchangeRateQueries } from '@/exchangeRates/graphql/resolvers';
import { queries as formQueries } from '@/forms/graphql/resolvers';
import { organizationConfigQueries } from '@/organization/settings/graphql/configs/queries';
import { favoriteQueries } from '@/organization/settings/graphql/favorites/queries';
import { structureQueries } from '@/organization/structure/graphql/resolvers/queries';
import { userQueries } from '@/organization/team-member/graphql/queries';
import { permissionQueries } from '@/permissions/graphql/resolvers/queries/permission';
import { usersGroupQueries } from '@/permissions/graphql/resolvers/queries/userGroup';
import { productQueries } from '@/products/graphql/resolvers/queries';
import { relationsQueries } from '@/relations/graphql/queries';
import { segmentQueries } from '@/segments/graphql/resolvers';
import { tagQueries } from '@/tags/graphql/queries';

export const queries = {
  ...contactQueries,
  ...authQueries,
  ...userQueries,
  ...tagQueries,
  ...productQueries,
  ...appQueries,
  ...formQueries,
  ...segmentQueries,
  ...relationsQueries,
  ...favoriteQueries,
  ...structureQueries,
  ...organizationConfigQueries,
  ...exchangeRateQueries,
  ...permissionQueries,
  ...usersGroupQueries,
  ...documentQueries,
};
