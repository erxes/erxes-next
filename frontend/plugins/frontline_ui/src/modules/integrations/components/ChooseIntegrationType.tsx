import { useAtom, useSetAtom } from 'jotai';
import { integrationTypeCollapsibleState } from '../state/integrationCollapsibleState';
import { Button, Collapsible, Skeleton, useQueryState } from 'erxes-ui';
import { useUsedIntegrationTypes } from '../hooks/useUsedIntegrationTypes';
import { IIntegrationType } from '../types/Integration';
import { IconCheck } from '@tabler/icons-react';
import { selectMainFilterState } from '@/inbox/states/inboxLayoutState';

export const ChooseIntegrationType = () => {
  const [open, setOpen] = useAtom(integrationTypeCollapsibleState);

  return (
    <Collapsible
      className="group/integrationType"
      open={open}
      onOpenChange={setOpen}
    >
      <Collapsible.TriggerButton>
        <Collapsible.TriggerIcon className="group-data-[state=open]/integrationType:rotate-180" />
        Integrations
      </Collapsible.TriggerButton>
      <Collapsible.Content className="pl-1 flex flex-col gap-1 py-1 overflow-hidden">
        <ChooseIntegrationTypeContent open={open} />
      </Collapsible.Content>
    </Collapsible>
  );
};

const ChooseIntegrationTypeContent = ({ open }: { open: boolean }) => {
  const { integrationTypes, loading } = useUsedIntegrationTypes();

  if (loading) return <Skeleton className="w-32 h-4 mt-1" />;

  return integrationTypes?.map((integrationType: IIntegrationType) => (
    <IntegrationTypeItem key={integrationType._id} {...integrationType} />
  ));
};

export const IntegrationTypeItem = ({ _id, name }: IIntegrationType) => {
  const [integrationType, setIntegrationType] =
    useQueryState<string>('integrationType');
  const selectMainFilter = useSetAtom(selectMainFilterState);

  const isActive = integrationType === _id;

  const handleClick = () => {
    setIntegrationType(_id === integrationType ? null : _id);
    selectMainFilter();
  };

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
