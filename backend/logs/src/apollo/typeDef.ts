import gql from 'graphql-tag';
import { types as logTypes, queries as logQueries } from './schema';

const types = `
  scalar JSON
  scalar Date

  ${logTypes}

`;

const queries = `
  type Query {
      ${logQueries}
    }
`;

const typeDefs = async () => {
  return gql(`
      ${types} ${queries}
    `);
};

export default typeDefs;
