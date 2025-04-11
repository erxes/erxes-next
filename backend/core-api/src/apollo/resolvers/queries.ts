import { authQueries } from '../../modules/auth/graphql/resolvers/queries';
import { contactQueries } from '../../modules/contacts/graphql/resolvers/queries';
import { userQueries } from '../../modules/organization/team-member/graphql/queries';
import { productQueries } from '../../modules/products/graphql/resolvers/queries';
import { tagQueries } from '../../modules/tags/graphql/queries';
import { appQueries } from '../../modules/apps/graphql/queries';
export const queries = {
  ...contactQueries,
  ...authQueries,
  ...userQueries,
  ...tagQueries,
  ...productQueries,
  ...appQueries,
};
