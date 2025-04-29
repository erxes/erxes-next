import { Button, Select, Skeleton } from 'erxes-ui';
import { useChannels } from '../hooks/useChannels';
import { useQueryState } from '../hooks/useQueryState';
import { IconX } from '@tabler/icons-react';
import { IChannel } from '../types/Channel';

export const ChannelTag = () => {
  const [channelId, setChannelId] = useQueryState<string>('channelId');
  const { channels, loading } = useChannels({ skip: !channelId });

  if (!channelId) return null;

  return (
    <Button
      variant="secondary"
      className="pr-0.5 hover:bg-accent py-0 pl-0 gap-0"
      asChild
    >
      <div>
        {loading ? (
          <Skeleton className="w-4 h-32" />
        ) : (
          <>
            <Select value={channelId} onValueChange={setChannelId}>
              <Select.Trigger className="w-full h-full shadow-none rounded-none [&>svg]:hidden">
                <Select.Value placeholder="Select channel" />
              </Select.Trigger>
              <Select.Content>
                {channels?.map((c: IChannel) => (
                  <Select.Item key={c._id} value={c._id}>
                    {c.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 hover:bg-border"
              onClick={() => setChannelId(null)}
            >
              <IconX />
            </Button>
          </>
        )}
      </div>
    </Button>
  );
};
