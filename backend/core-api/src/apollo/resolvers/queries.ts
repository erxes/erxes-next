import { customerQueries } from '../../modules/contacts/graphql/resolvers/queries/customer';
import { authQueries } from '../../modules/auth/graphql/resolvers/queries';
import { userQueries } from '../../modules/organization/team-member/graphql/queries';

export const queries = {
  ...customerQueries,
  ...authQueries,
  ...userQueries
};
