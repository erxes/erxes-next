import { apolloCustomScalars } from 'erxes-api-utils';
import Query from './queries';
import Log from './shit';

const resolvers = {
  ...apolloCustomScalars,

  Log,
  Query,
};

export default resolvers;
