import { DocumentNode } from 'graphql';
import { gql } from 'graphql-tag';
import { types } from './schema/schema';

export const typeDefs = async (): Promise<DocumentNode> => {
  return gql(`
    ${types}
  `);
};
