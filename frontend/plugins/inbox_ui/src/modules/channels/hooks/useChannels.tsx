import { OperationVariables, useQuery } from '@apollo/client';

import { GET_CHANNELS } from '@/channels/graphql/queries/getChannels';

export const useChannels = (options?: OperationVariables) => {
  const { data, loading } = useQuery(GET_CHANNELS, options);

  return { channels: data?.channelsByMembers, loading };
};
