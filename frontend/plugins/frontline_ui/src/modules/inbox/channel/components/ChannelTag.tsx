import { Filter, Select, Skeleton, useQueryState } from 'erxes-ui';
import { useChannels } from '@/inbox/channel/hooks/useChannels';
import { IChannel } from '@/inbox/types/Channel';

export const ChannelTag = () => {
  const [channelId, setChannelId] = useQueryState<string>('channelId');
  const { channels, loading } = useChannels({ skip: !channelId });

  if (!channelId) return null;

  return (
    <Filter.BarItem>
      {loading ? (
        <Skeleton className="w-32 h-4" />
      ) : (
        <Select value={channelId} onValueChange={setChannelId}>
          <Select.Primitive.Trigger asChild>
            <Filter.BarButton className="rounded-l shadow-none">
              <Select.Value placeholder="Select channel" />
            </Filter.BarButton>
          </Select.Primitive.Trigger>
          <Select.Content>
            {channels?.map((c: IChannel) => (
              <Select.Item key={c._id} value={c._id}>
                {c.name}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      )}
      <Filter.BarClose filterKey="channelId" />
    </Filter.BarItem>
  );
};
