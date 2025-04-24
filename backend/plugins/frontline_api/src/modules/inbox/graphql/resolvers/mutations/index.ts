import { channelMutations } from './channels';
import { conversationMutations } from './conversations';
import { integrationMutations } from './integrations';
export const frontlineMutations = {
  ...channelMutations,
  ...conversationMutations,
  ...integrationMutations,
};
