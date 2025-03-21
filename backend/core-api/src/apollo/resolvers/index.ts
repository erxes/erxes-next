import { queries } from './queries';
import { mutations } from './mutations';
import { apolloCustomScalars } from 'erxes-api-utils';

import * as customerResolvers from '../../modules/contacts/graphql/resolvers/customResolvers/customer';

const resolvers: any = {
  Mutation: {
    ...mutations,
  },
  Query: {
    ...queries,
  },
  ...apolloCustomScalars,
  ...customerResolvers,
};

export default resolvers;
