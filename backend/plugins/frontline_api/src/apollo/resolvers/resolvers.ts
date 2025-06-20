import inboxResolvers from '@/inbox/graphql/resolvers/customResolvers';
import ticketResolvers from '~/modules/tickets/graphql/resolvers/customResolvers';

export const customResolvers = {
  ...inboxResolvers,
  ...ticketResolvers,
};
