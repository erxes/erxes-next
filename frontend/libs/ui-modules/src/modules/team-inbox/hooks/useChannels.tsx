import { OperationVariables, useQuery } from '@apollo/client';
import { GET_CHANNELS } from '../graphql/queries/getChannels';
import { IChannel } from '../types/Channel';

export const useChannels = (options?: OperationVariables) => {
  const { data, loading, fetchMore, error } = useQuery<{
    channels: IChannel[];
    channelsTotalCount: number;
  }>(GET_CHANNELS, options);

  const handleFetchMore = () => {
    fetchMore({
      variables: {
        ...options,
      },
    });
  };

  return {
    channels: data?.channels,
    totalCount: data?.channelsTotalCount,
    loading,
    error,
    handleFetchMore,
  };
};
