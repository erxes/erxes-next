import customScalars from './customScalars';
import queries from './queries';
import mutations from './mutations';

const resolvers: any = {
  ...customScalars,

  Mutation: {
    ...mutations
  },
  Query: {
    ...queries
  }
};

export default resolvers;
