import { apolloCustomScalars } from 'erxes-api-utils';
import { customResolvers } from './resolvers';

const resolvers: any = {
  ...apolloCustomScalars,
  ...customResolvers,
};

export default resolvers;
