import { useAtom } from 'jotai';
import { integrationKindCollapsibleState } from '../state/integrationCollapsibleState';
import { Button, Collapsible, Skeleton, useMultiQueryState } from 'erxes-ui';
import { useUsedIntegrationKinds } from '../hooks/useUsedIntegrationKinds';
import { IIntegrationKind } from '../types/Integration';
import { IconCheck } from '@tabler/icons-react';

export const ChooseIntegrationKind = () => {
  const [open, setOpen] = useAtom(integrationKindCollapsibleState);

  return (
    <Collapsible
      className="group/integrationKind"
      open={open}
      onOpenChange={setOpen}
    >
      <Collapsible.TriggerButton>
        <Collapsible.TriggerIcon className="group-data-[state=open]/integrationKind:rotate-180" />
        Integrations
      </Collapsible.TriggerButton>
      <Collapsible.Content className="pl-1 flex flex-col gap-1 py-1 overflow-hidden">
        <ChooseIntegrationKindContent open={open} />
      </Collapsible.Content>
    </Collapsible>
  );
};

const ChooseIntegrationKindContent = ({ open }: { open: boolean }) => {
  const { integrationKinds, loading } = useUsedIntegrationKinds();

  if (loading) return <Skeleton className="w-32 h-4 mt-1" />;

  return integrationKinds?.map((integrationKind: IIntegrationKind) => (
    <IntegrationKindItem key={integrationKind._id} {...integrationKind} />
  ));
};

export const IntegrationKindItem = ({ _id, name }: IIntegrationKind) => {
  const [{ integrationKind }, setValues] = useMultiQueryState<{
    integrationKind: string;
    detailView: boolean;
  }>(['integrationKind', 'detailView']);

  const isActive = integrationKind === _id;

  const handleClick = () =>
    setValues({
      integrationKind: _id,
      detailView: true,
    });

  return (
    <Button
      variant={isActive ? 'secondary' : 'ghost'}
      className="justify-start pl-7 relative overflow-hidden text-left flex-auto"
      onClick={handleClick}
    >
      {isActive && <IconCheck className="absolute left-1.5" />}
      {name}
    </Button>
  );
};
