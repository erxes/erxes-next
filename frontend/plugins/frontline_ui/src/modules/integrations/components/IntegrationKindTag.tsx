import {
  Combobox,
  Command,
  Filter,
  Popover,
  Skeleton,
  TextOverflowTooltip,
  useQueryState,
} from 'erxes-ui';
import { useUsedIntegrationKinds } from '../hooks/useUsedIntegrationKinds';
import { IIntegrationKind } from '../types/Integration';

export const IntegrationKindTag = () => {
  const [integrationKindId, setIntegrationKindId] =
    useQueryState<string>('integrationKind');
  const { integrationKinds, loading } = useUsedIntegrationKinds();

  const integrationKind = integrationKinds?.find(
    (integrationKind: IIntegrationKind) =>
      integrationKind._id === integrationKindId,
  );

  if (!integrationKind) return null;

  if (loading) {
    return <Skeleton className="w-20 h-4" />;
  }

  return (
    <Filter.BarItem>
      <Popover>
        <Popover.Trigger asChild>
          <Filter.BarButton>{integrationKind.name}</Filter.BarButton>
        </Popover.Trigger>
        <Combobox.Content>
          <Command>
            <Command.Input placeholder="Select integration" />
            <Command.List>
              {integrationKinds?.map((integrationKind: IIntegrationKind) => (
                <Command.Item
                  value={integrationKind._id}
                  key={integrationKind._id}
                  onSelect={() => setIntegrationKindId(integrationKind._id)}
                >
                  <TextOverflowTooltip value={integrationKind.name} />
                  <Combobox.Check
                    checked={integrationKind._id === integrationKindId}
                  />
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </Combobox.Content>
      </Popover>
      <Filter.BarClose filterKey="integrationType" />
    </Filter.BarItem>
  );
};
