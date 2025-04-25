import { Button, Select, Skeleton } from 'erxes-ui';
import { useQueryState } from '../hooks/useQueryState';
import { useIntegrations } from '../hooks/useIntegrations';
import { IIntegration } from '../types/Integration';
import { IconX } from '@tabler/icons-react';

export const IntegrationTag = () => {
  const [integrationType, setIntegrationType] =
    useQueryState<string>('integrationType');
  const { integrations, loading } = useIntegrations({
    skip: !integrationType,
  });

  if (!integrationType) return null;

  return (
    <Button
      variant="secondary"
      className="pr-0.5 hover:bg-accent py-0 pl-0 gap-0"
      asChild
    >
      <div>
        {loading ? (
          <Skeleton className="w-20 h-4" />
        ) : (
          <>
            <Select value={integrationType} onValueChange={setIntegrationType}>
              <Select.Trigger className="w-full h-full shadow-none rounded-none [&>svg]:hidden">
                <Select.Value placeholder="Select integration" />
              </Select.Trigger>
              <Select.Content>
                {integrations?.map((integration: IIntegration) => (
                  <Select.Item key={integration._id} value={integration._id}>
                    {integration.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 hover:bg-border"
              onClick={() => setIntegrationType(null)}
            >
              <IconX />
            </Button>
          </>
        )}
      </div>
    </Button>
  );
};
