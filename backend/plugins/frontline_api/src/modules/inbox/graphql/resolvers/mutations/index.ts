import { channelMutations } from './channels';
import { conversationMutations } from './conversations';
import { integrationMutations } from './integrations';
import { widgetMutations } from './widget';

export const mutations = {
  ...channelMutations,
  ...conversationMutations,
  ...integrationMutations,
  ...widgetMutations,
};
