import { authQueries } from '@/auth/graphql/resolvers/queries';
import { contactQueries } from '@/contacts/graphql/resolvers/queries';
import { userQueries } from '@/organization/team-member/graphql/queries';
import { productQueries } from '@/products/graphql/resolvers/queries';
import { tagQueries } from '@/tags/graphql/queries';
import { appQueries } from '@/apps/graphql/queries';
<<<<<<< HEAD
import { queries as formQueries } from '@/forms/apollo/resolvers';
import { segmentQueries } from '@/segments/apollo/resolvers/queries';
=======
import { relationsQueries } from '@/relations/graphql/queries';
>>>>>>> ef4e23ea5f9913af17c83d142489022de3df55d7

export const queries = {
  ...contactQueries,
  ...authQueries,
  ...userQueries,
  ...tagQueries,
  ...productQueries,
  ...appQueries,
<<<<<<< HEAD
  ...formQueries,
  ...segmentQueries,
=======
  ...relationsQueries,
>>>>>>> ef4e23ea5f9913af17c83d142489022de3df55d7
};
