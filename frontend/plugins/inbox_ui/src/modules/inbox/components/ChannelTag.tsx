import { Button, Skeleton } from 'erxes-ui';
import { useChannels } from '../hooks/useChannels';
import { useQueryState } from '../hooks/useQueryState';
import { IconX } from '@tabler/icons-react';
import { IChannel } from '../types/Channel';

export const ChannelTag = () => {
  const [channelId, setChannelId] = useQueryState<string>('channelId');
  const { channels, loading } = useChannels({ skip: !channelId });

  if (!channelId) return null;

  const channel = channels?.find((c: IChannel) => c._id === channelId);

  return (
    <Button variant="secondary" className="pr-0.5 hover:bg-accent" asChild>
      <div>
        {loading ? (
          <Skeleton className="w-4 h-32" />
        ) : (
          <>
            {channel?.name}
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
