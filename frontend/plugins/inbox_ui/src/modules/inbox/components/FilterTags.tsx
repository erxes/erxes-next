import { useMultiQueryState } from '../hooks/useQueryState';
import { ChannelTag } from './ChannelTag';

export const FilterTags = () => {
  const [{ channelId }] = useMultiQueryState<{ channelId: string }>([
    'channelId',
  ]);

  if (!channelId) return null;

  return (
    <div className="flex flex-col gap-1 px-2 pt-2">
      <span className="text-xs text-muted-foreground">Filters:</span>
      <div className="flex flex-wrap gap-2">
        <ChannelTag />
      </div>
    </div>
  );
};
