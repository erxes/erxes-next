import { Filter, Select, Skeleton } from 'erxes-ui';
import { useQueryState } from 'erxes-ui';
import { useIntegrations } from '@/integrations/hooks/useIntegrations';
import { IIntegration } from '@/integrations/types/Integration';

export const IntegrationTag = () => {
  const [integrationType, setIntegrationType] =
    useQueryState<string>('integrationType');
  const { integrations, loading } = useIntegrations({
    skip: !integrationType,
  });

  if (!integrationType) return null;

  return (
    <Filter.BarItem>
      {loading ? (
        <Skeleton className="w-20 h-4" />
      ) : (
        <Select value={integrationType} onValueChange={setIntegrationType}>
          <Select.Primitive.Trigger asChild>
            <Filter.BarButton className="rounded-l shadow-none">
              <Select.Value placeholder="Select integration" />
            </Filter.BarButton>
          </Select.Primitive.Trigger>
          <Select.Content>
            {integrations?.map((integration: IIntegration) => (
              <Select.Item key={integration._id} value={integration._id}>
                {integration.name}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      )}
      <Filter.BarClose filterKey="integrationType" />
    </Filter.BarItem>
  );
};
