import { apolloCustomScalars } from 'erxes-api-shared/utils';
import Query from './queries';
import customResolver from './customResolver';

const resolvers = {
  ...apolloCustomScalars,
  ...customResolver,

  Query,
};

export default resolvers;
