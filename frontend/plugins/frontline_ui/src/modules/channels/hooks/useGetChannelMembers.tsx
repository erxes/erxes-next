import { GET_CHANNEL_MEMBERS } from '@/channels/graphql/queries';
import { IChannelMember } from '@/channels/types';
import { useQuery } from '@apollo/client';

interface IGetChannelMembersQueryResponse {
  getChannelMembers: IChannelMember[];
}

export const useGetChannelMembers = ({
  channelIds,
}: {
  channelIds?: string[] | string;
}) => {
  const { data, loading } = useQuery<IGetChannelMembersQueryResponse>(
    GET_CHANNEL_MEMBERS,
    {
      variables: {
        channelIds,
      },
    },
  );
  const members = data?.getChannelMembers;
  return { members, loading };
};
