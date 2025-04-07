import { apolloCustomScalars } from 'erxes-api-utils';
import Query from './queries';

const resolvers = {
  ...apolloCustomScalars,
  Query,
};

export default resolvers;
