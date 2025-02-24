import { useMultiQueryState } from '../hooks/useQueryState';
import { ChannelTag } from './ChannelTag';
import { IntegrationTag } from './IntegrationTag';
export const FilterTags = () => {
  const [{ channelId, integrationType }] = useMultiQueryState<{
    channelId: string;
    integrationType: string;
  }>(['channelId', 'integrationType']);

  if (!channelId && !integrationType) return null;

  return (
    <div className="flex flex-col gap-2 px-2 pt-4">
      <span className="text-xs text-accent-foreground">Filters:</span>
      <div className="flex flex-wrap gap-2">
        <ChannelTag />
        <IntegrationTag />
      </div>
    </div>
  );
};
