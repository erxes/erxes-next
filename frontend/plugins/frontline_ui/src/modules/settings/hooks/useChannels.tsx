import { OperationVariables, useQuery } from '@apollo/client';
import { GET_CHANNELS } from '../graphql';

export const useChannels = (options?: OperationVariables) => {
  const { data, loading, error } = useQuery(GET_CHANNELS, options);
  const channels = data?.channels || [];
  return {
    channels,
    error,
    loading,
  };
};
