import { Button, Collapsible, Skeleton } from 'erxes-ui/components';
import { useIntegrations } from '@/inbox/hooks/useIntegrations';
import { useAtom } from 'jotai';
import { integrationCollapsibleState } from '../states/integrationCollapsibleState';
import { IIntegration } from '../types/Integration';
import { IconCheck } from '@tabler/icons-react';
import { useMultiQueryState } from '../hooks/useQueryState';

export const ChooseIntegration = () => {
  const [open, setOpen] = useAtom(integrationCollapsibleState);

  return (
    <Collapsible
      title="Choose Integration"
      className="group/integration"
      open={open}
      onOpenChange={setOpen}
    >
      <Collapsible.TriggerButton>
        <Collapsible.TriggerIcon className="group-data-[state=open]/integration:rotate-180" />
        Integrations
      </Collapsible.TriggerButton>
      <Collapsible.Content className="pl-1 flex flex-col gap-1 py-1">
        <ChooseIntegrationContent open={open} />
      </Collapsible.Content>
    </Collapsible>
  );
};

const ChooseIntegrationContent = ({ open }: { open: boolean }) => {
  const { integrations, loading, conversationCounts } = useIntegrations({
    variables: {
      only: 'byIntegrationTypes',
      limit: 100,
    },
    skip: !open,
  });

  if (loading)
    return (
      <>
        <Skeleton className="w-32 h-4 mt-1" />
        <Skeleton className="w-36 h-4 mt-1" />
        <Skeleton className="w-32 h-4 mt-1" />
      </>
    );

  if (integrations?.length === 0) return null;

  return integrations?.map((integration: IIntegration) => (
    <IntegrationItem key={integration._id} {...integration} />
  ));
};

const IntegrationItem = ({ _id, name }: IIntegration) => {
  const [{ integrationType }, setValues] = useMultiQueryState<{
    integrationType: string;
    detailView: boolean;
  }>(['integrationType', 'detailView']);

  const isActive = integrationType === _id;

  const handleClick = () =>
    setValues({
      integrationType: _id,
      detailView: true,
    });

  return (
    <Button
      variant={isActive ? 'secondary' : 'ghost'}
      className="w-full justify-start pl-7 relative"
      onClick={handleClick}
    >
      {isActive && <IconCheck className="absolute left-1.5" />}
      <span className="overflow-hidden truncate">{name}</span>
      <span className="ml-auto text-xs text-accent-foreground">{0}</span>
    </Button>
  );
};
