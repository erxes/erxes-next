import { TypeExtensions } from '../../modules/inbox/graphql/schemas/extensions';
import {
  mutations as ChannelsMutations,
  queries as ChannelsQueries,
  types as ChannelsTypes,
} from '@/inbox/graphql/schemas/channel';

import {
  mutations as ConversationsMutations,
  queries as ConversationsQueries,
  types as ConversationsTypes,
} from '@/inbox/graphql/schemas/conversation';

import {
  mutations as IntegrationsMutations,
  queries as IntegrationsQueries,
  types as IntegrationsTypes,
} from '@/inbox/graphql/schemas/integration';
export const types = `
    ${TypeExtensions}
    ${ChannelsTypes}
    ${ConversationsTypes}
    ${IntegrationsTypes}
  `;
export const queries = `
    ${ChannelsQueries}
    ${ConversationsQueries}
    ${IntegrationsQueries}
  `;

export const mutations = `
   ${ChannelsMutations}
   ${ConversationsMutations}
   ${IntegrationsMutations}
`;
export default { types, queries, mutations };
