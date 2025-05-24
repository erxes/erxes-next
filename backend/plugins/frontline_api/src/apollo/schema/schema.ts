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

import {
  mutations as FacebookMutations,
  queries as FacebookQueries,
  types as FacebookTypes,
} from '@/integrations/facebook/graphql/schema/facebook';


import {
  mutations as IMapMutations,
  queries as IMapQueries,
  types as IMapTypes,
} from '@/integrations/imap/graphql/schemas';

export const types = `
    ${TypeExtensions}
    ${ChannelsTypes}
    ${ConversationsTypes}
    ${IntegrationsTypes}
    ${FacebookTypes}
    ${IMapTypes}
  `;
export const queries = `
    ${ChannelsQueries}
    ${ConversationsQueries}
    ${IntegrationsQueries}
    ${FacebookQueries}
    ${IMapQueries}
  `;

export const mutations = `
   ${ChannelsMutations}
   ${ConversationsMutations}
   ${IntegrationsMutations}
   ${FacebookMutations}
   ${IMapMutations}
`;
export default { types, queries, mutations };
