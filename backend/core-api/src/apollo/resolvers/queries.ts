import { customerQueries } from '../../modules/contacts/graphql/resolvers/queries/customer';
import { authQueries } from '../../modules/auth/graphql/resolvers/queries';

export const queries = {
  ...customerQueries,
  ...authQueries,
};
