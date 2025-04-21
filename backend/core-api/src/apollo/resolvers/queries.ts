import { authQueries } from '@/auth/graphql/resolvers/queries';
import { contactQueries } from '@/contacts/graphql/resolvers/queries';
import { userQueries } from '@/organization/team-member/graphql/queries';
import { productQueries } from '@/products/graphql/resolvers/queries';
import { tagQueries } from '@/tags/graphql/queries';
import { appQueries } from '@/apps/graphql/queries';
export const queries = {
  ...contactQueries,
  ...authQueries,
  ...userQueries,
  ...tagQueries,
  ...productQueries,
  ...appQueries,
};
