import { authQueries } from '@/auth/graphql/resolvers/queries';
import { contactQueries } from '@/contacts/graphql/resolvers/queries';
import { userQueries } from '@/organization/team-member/graphql/queries';
import { productQueries } from '@/products/graphql/resolvers/queries';
import { tagQueries } from '@/tags/graphql/queries';
import { appQueries } from '@/apps/graphql/queries';
import { queries as formQueries } from '@/forms/apollo/resolvers';
import { segmentQueries } from '@/segments/apollo/resolvers/queries';

export const queries = {
  ...contactQueries,
  ...authQueries,
  ...userQueries,
  ...tagQueries,
  ...productQueries,
  ...appQueries,
  ...formQueries,
  ...segmentQueries,
};
