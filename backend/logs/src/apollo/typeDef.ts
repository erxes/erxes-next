import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { types as logTypes, queries as logQueries } from './schema';

const types = `
  scalar JSON
  scalar Date

  type User @key(fields: "_id") {
    _id: String!
  }

  ${logTypes}
`;

const queries = `
  type Query {
      ${logQueries}
    }
`;

const typeDefs = async (): Promise<DocumentNode> => {
  return gql(`
      ${types} ${queries}
    `);
};

export default typeDefs;
