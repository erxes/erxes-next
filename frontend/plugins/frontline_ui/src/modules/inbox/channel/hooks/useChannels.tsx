import { useQuery, QueryHookOptions } from '@apollo/client';

import {
  GET_CHANNELS,
  GET_CHANNELS_BY_MEMBERS,
} from '@/inbox/conversations/graphql/queries/getChannels';
import { useAtomValue } from 'jotai';
import { currentUserState } from 'ui-modules';
import { IChannel } from '@/inbox/types/Channel';

export const useChannelsByMembers = (
  options?: QueryHookOptions<{ channelsByMembers: IChannel[] }>,
) => {
  const currentUser = useAtomValue(currentUserState);

  const { data, loading } = useQuery<{ channelsByMembers: IChannel[] }>(
    GET_CHANNELS_BY_MEMBERS,
    {
      ...options,
      variables: {
        memberIds: [currentUser?._id],
        ...options?.variables,
      },
    },
  );

  return { channels: data?.channelsByMembers, loading };
};

export const useGetChannels = (options?: QueryHookOptions) => {
  const { data, loading } = useQuery(GET_CHANNELS, options);

  const channels = data?.getChannels;

  return { channels, loading };
};
