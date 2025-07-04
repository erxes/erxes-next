import { channelQueries } from '@/inbox/graphql/resolvers/queries/channels';
import { conversationQueries } from '@/inbox/graphql/resolvers/queries/conversations';
import { integrationQueries } from '@/inbox/graphql/resolvers/queries/integrations';
import { facebookQueries } from '@/integrations/facebook/graphql/resolvers/queries';
import callQueries from '@/integrations/call/graphql/resolvers/queries';

export const queries = {
  ...channelQueries,
  ...conversationQueries,
  ...integrationQueries,
  ...facebookQueries,
  ...callQueries,
};
