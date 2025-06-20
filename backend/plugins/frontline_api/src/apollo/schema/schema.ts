import {
  mutations as ChannelsMutations,
  queries as ChannelsQueries,
  types as ChannelsTypes,
} from '@/inbox/graphql/schemas/channel';
import { TypeExtensions } from './extensions';

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

import {
  mutations as FacebookMutations,
  queries as FacebookQueries,
  types as FacebookTypes,
} from '@/integrations/facebook/graphql/schema/facebook';

import {
  mutations as TicketsMutations,
  queries as TicketsQueries,
  types as TicketsTypes,
} from '~/modules/tickets/graphql/schemas';

export const types = `
    ${TypeExtensions}
    ${ChannelsTypes}
    ${ConversationsTypes}
    ${IntegrationsTypes}
    ${FacebookTypes}
    ${TicketsTypes}
  `;
export const queries = `
    ${ChannelsQueries}
    ${ConversationsQueries}
    ${IntegrationsQueries}
    ${FacebookQueries}
    ${TicketsQueries}
  `;

export const mutations = `
   ${ChannelsMutations}
   ${ConversationsMutations}
   ${IntegrationsMutations}
   ${FacebookMutations}
   ${TicketsMutations}
`;
export default { types, queries, mutations };
