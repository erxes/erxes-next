import { channelQueries } from '@/inbox/graphql/resolvers/queries/channels';
import { conversationQueries } from '@/inbox/graphql/resolvers/queries/conversations';
import { integrationQueries } from '@/inbox/graphql/resolvers/queries/integrations';
export const queries = {
  ...channelQueries,
  ...conversationQueries,
  ...integrationQueries,
};
