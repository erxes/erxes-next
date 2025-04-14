import {
  apolloCustomScalars,
  wrapApolloMutations,
} from 'erxes-api-shared/utils';
import Query from './queries';
import Mutation from './mutations';
import customResolver from './customResolver';

const resolvers: any = {
  ...apolloCustomScalars,
  ...customResolver,

  Query,
  Mutation: wrapApolloMutations(Mutation || {}),
};

export default resolvers;
