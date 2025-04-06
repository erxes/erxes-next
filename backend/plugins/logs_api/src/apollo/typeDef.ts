import gql from 'graphql-tag';
import { types } from './schema';

const typeDefs = async () => {
  return gql(`
      ${types}
    `);
};

export default typeDefs;
