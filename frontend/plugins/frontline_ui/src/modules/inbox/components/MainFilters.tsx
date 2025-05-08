import { IconUserFilled, IconUserUp } from '@tabler/icons-react';
import { Button, Collapsible } from 'erxes-ui';
import { ChooseChannel } from '@/inbox/components/ChooseChannel';
import { ChooseIntegration } from '@/inbox/components/ChooseIntegration';
import { useMultiQueryState } from '../hooks/useQueryState';

export const MainFilters = () => {
  const [, setQueryStates] = useMultiQueryState<{
    assignedToMe: boolean;
    detailView: boolean;
  }>(['assignedToMe', 'detailView']);

  return (
    <Collapsible
      className="group/collapsible flex flex-col gap-1 py-4 px-2"
      defaultOpen
    >
      <Collapsible.TriggerButton>
        <Collapsible.TriggerIcon className="group-data-[state=open]/collapsible:rotate-180" />
        Team Inbox
      </Collapsible.TriggerButton>
      <Collapsible.Content className="pl-4 flex flex-col gap-1">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() =>
            setQueryStates({
              detailView: true,
            })
          }
        >
          <IconUserFilled className="text-accent-foreground" />
          Team Inbox
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() =>
            setQueryStates({
              assignedToMe: true,
              detailView: true,
            })
          }
        >
          <IconUserUp className="text-accent-foreground" />
          Assigned to me
        </Button>
        <ChooseChannel />
        <ChooseIntegration />
      </Collapsible.Content>
    </Collapsible>
  );
};
