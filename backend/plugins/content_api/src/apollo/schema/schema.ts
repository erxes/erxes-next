import { TypeExtensions } from './extensions';
import {
  mutations as knowledgeBaseMutations,
  queries as knowledgeBaseQueries,
  types as knowledgeBaseTypes,
} from '@/knowledgebase/graphql/schemas/index';

export const types = `
    ${TypeExtensions}
    ${knowledgeBaseTypes}

  `;

export const queries = `
    ${knowledgeBaseQueries}
  `;

export const mutations = `
    ${knowledgeBaseMutations}
  `;

export default { types, queries, mutations };
