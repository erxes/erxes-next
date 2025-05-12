import { authQueries } from '@/auth/graphql/resolvers/queries';
import { contactQueries } from '@/contacts/graphql/resolvers/queries';
import { userQueries } from '@/organization/team-member/graphql/queries';
import { productQueries } from '@/products/graphql/resolvers/queries';
import { tagQueries } from '@/tags/graphql/queries';
import { appQueries } from '@/apps/graphql/queries';
import { queries as formQueries } from '@/forms/apollo/resolvers';
import { queries as segmentQueries } from '@/segments/apollo/resolvers';
import { relationsQueries } from '@/relations/graphql/queries';
import { favoriteQueries } from '@/organization/settings/graphql/favorites/queries';

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
};
