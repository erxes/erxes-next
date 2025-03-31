import { authQueries } from '../../modules/auth/graphql/resolvers/queries';
import { contactQueries } from '../../modules/contacts/graphql/resolvers/queries';
import { userQueries } from '../../modules/organization/team-member/graphql/queries';
import { productQueries } from '../../modules/products/graphql/resolvers/queries';

export const queries = {
  ...contactQueries,
  ...authQueries,
  ...userQueries,
  ...productQueries,
};
