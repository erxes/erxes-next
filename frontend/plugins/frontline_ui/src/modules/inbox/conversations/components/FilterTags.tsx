import { Button } from 'erxes-ui';
import { useMultiQueryState, useQueryState } from 'erxes-ui';
import { ChannelTag } from '@/inbox/channel/components/ChannelTag';
import { IconX } from '@tabler/icons-react';
import { BOOLEAN_FILTERS } from '../../constants/booleanFilters';
import { IntegrationKindTag } from '@/integrations/components/IntegrationKindTag';

export const FilterTags = () => {
  const [{ channelId, integrationKind, status }] = useMultiQueryState<{
    channelId: string;
    integrationKind: string;
    status: string;
  }>(['channelId', 'integrationKind', 'status']);

  if (!channelId && !integrationKind) return null;

  return (
    <div className="flex flex-col gap-2 px-2 pt-4">
      <span className="text-xs text-accent-foreground">Filters:</span>
      <div className="flex flex-wrap gap-2">
        <ChannelTag />
        <IntegrationKindTag />
        {status === 'closed' && (
          <FilterTagBoolean label="Resolved" statusKey="status" />
        )}
        {BOOLEAN_FILTERS.map((filter) => (
          <FilterTagBoolean
            key={filter.statusKey}
            label={filter.label}
            statusKey={filter.statusKey}
          />
        ))}
      </div>
    </div>
  );
};

const FilterTagBoolean = ({
  label,
  statusKey,
}: {
  label: string;
  statusKey: string;
}) => {
  const [status, setStatus] = useQueryState<boolean>(statusKey);

  if (!status) return null;

  return (
    <div className="inline-flex">
      <Button
        variant="secondary"
        className="rounded-r-none hover:bg-accent cursor-default"
        asChild
      >
        <div>{label}</div>
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="rounded-l-none"
        onClick={() => setStatus(null)}
      >
        <IconX />
      </Button>
    </div>
  );
};
