import { apolloCustomScalars } from 'erxes-api-utils';
import { mutations } from './mutations';
import { queries } from './queries';
import { customResolvers } from './resolvers';

const resolvers: any = {
  Mutation: {
    ...mutations,
  },
  Query: {
    ...queries,
  },
  ...apolloCustomScalars,
  ...customResolvers,
};

export default resolvers;
