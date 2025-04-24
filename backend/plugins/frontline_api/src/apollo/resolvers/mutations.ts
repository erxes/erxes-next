import { channelMutations } from '@/inbox/graphql/resolvers/mutations/channels';
import { conversationMutations } from '@/inbox/graphql/resolvers/mutations/conversations';
import { integrationMutations } from '@/inbox/graphql/resolvers/mutations/integrations';

export const mutations = {
  ...channelMutations,
  ...conversationMutations,
  ...integrationMutations,
};
