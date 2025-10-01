import {
  mutations as ChannelMutations,
  queries as ChannelQueries,
  types as ChannelTypes,
} from './channel';

import {
  mutations as ConversationMutations,
  queries as ConversationQueries,
  types as ConversationTypes,
} from './conversation';
import {
  mutations as IntegrationMutations,
  queries as IntegrationQueries,
  types as integrationTypes,
} from './integration';

import {
  mutations as WidgetMutations,
  queries as WidgetQueries,
  types as WidgetTypes,
} from './widget';

export const types = `
  ${ChannelTypes},
  ${ConversationTypes}
  ${integrationTypes}
  ${WidgetTypes}
`;

export const queries = `
  ${ChannelQueries}
  ${ConversationQueries}
  ${IntegrationQueries}
  ${WidgetQueries}
`;

export const mutations = `
  ${ChannelMutations}
  ${ConversationMutations}
  ${IntegrationMutations}
  ${WidgetMutations}
`;
