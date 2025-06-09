import {
  Combobox,
  Command,
  Filter,
  Popover,
  Skeleton,
  TextOverflowTooltip,
} from 'erxes-ui';
import { useQueryState } from 'erxes-ui';
import { useIntegrations } from '@/integrations/hooks/useIntegrations';
import { IIntegration } from '@/integrations/types/Integration';

export const IntegrationTag = () => {
  const [integrationType, setIntegrationType] =
    useQueryState<string>('integrationType');
  const { integrations, loading } = useIntegrations({
    skip: !integrationType,
  });

  const integration = integrations?.find(
    (integration: IIntegration) => integration._id === integrationType,
  );

  if (!integrationType) return null;

  return (
    <Filter.BarItem>
      {loading ? (
        <Skeleton className="w-20 h-4" />
      ) : (
        <Popover>
          <Popover.Trigger asChild>
            <Filter.BarButton className="rounded-l shadow-none truncate text-left justify-start">
              <Combobox.Value
                placeholder="Select integration"
                value={integration?.name}
              />
            </Filter.BarButton>
          </Popover.Trigger>
          <Combobox.Content>
            <Command>
              <Command.Input placeholder="Select integration" />
              <Command.List>
                {integrations?.map((integration: IIntegration) => (
                  <Command.Item
                    value={integration._id}
                    onSelect={() => setIntegrationType(integration._id)}
                  >
                    <TextOverflowTooltip value={integration.name} />
                    <Combobox.Check
                      checked={integration._id === integrationType}
                    />
                  </Command.Item>
                ))}
              </Command.List>
            </Command>
          </Combobox.Content>
        </Popover>
      )}
      <Filter.BarClose filterKey="integrationType" />
    </Filter.BarItem>
  );
};
