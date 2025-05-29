import { TypeExtensions } from './extensions';
import {
  mutations as knowledgeBaseMutations,
  queries as knowledgeBaseQueries,
  types as knowledgeBaseTypes,
} from '@/knowledgebase/graphql/schemas/index';
import {
  queries as vercelQueries,
  mutations as vercelMutations,
} from '@/portal/graphql/schemas/vercel';
import {
  queries as portalQueries,
  mutations as portalMutations,
  types as portalTypes,
  inputs as portalInputs,
} from '@/portal/graphql/schemas/portal';
import {
  queries as userQueries,
  mutations as userMutations,
  types as userTypes,
  inputs as userInputs,
} from '@/portal/graphql/schemas/user';
import {
  queries as commentQueries,
  types as commentTypes,
} from '@/portal/graphql/schemas/comment';
import {
  queries as notificationQueries,
  types as notificationTypes,
  inputs as notificationInputs,
  mutations as notificationMutations,
} from '@/portal/graphql/schemas/notifications';

export const types = `
    ${TypeExtensions}
    ${knowledgeBaseTypes}
    ${portalTypes}
    ${portalInputs}
    ${userTypes}
    ${userInputs} 
    ${commentTypes}
    ${notificationTypes}
    ${notificationInputs}
  `;

export const queries = `
    ${knowledgeBaseQueries}
    ${vercelQueries}
    ${portalQueries}
    ${userQueries}
    ${commentQueries}
    ${notificationQueries}
  `;

export const mutations = `
    ${knowledgeBaseMutations}
    ${vercelMutations}
    ${portalMutations}
    ${userMutations}
    ${notificationMutations}
  `;

export default { types, queries, mutations };
