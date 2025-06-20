import { channelQueries } from '@/inbox/graphql/resolvers/queries/channels';
import { conversationQueries } from '@/inbox/graphql/resolvers/queries/conversations';
import { integrationQueries } from '@/inbox/graphql/resolvers/queries/integrations';
import { facebookQueries } from '@/integrations/facebook/graphql/resolvers/queries';
import { queries as ticketQueries } from '~/modules/tickets/graphql/resolvers/queries';

export const queries = {
  ...channelQueries,
  ...conversationQueries,
  ...integrationQueries,
  ...facebookQueries,
  ...ticketQueries,
};
