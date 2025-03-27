import { OperationVariables, useQuery } from '@apollo/client';
import { GET_CHANNEL_BY_ID } from '../graphql/queries/getChannels';

export const useChannelById = (options: OperationVariables) => {
  const { data, loading } = useQuery(GET_CHANNEL_BY_ID, {
    skip: !options.variables?.id,
    ...options,
  });
  const { channelDetail } = data || {};
  return { channelDetail, loading };
};
