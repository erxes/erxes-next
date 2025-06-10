import { IconUserFilled, IconUserUp } from '@tabler/icons-react';
import { Button, Collapsible, ScrollArea } from 'erxes-ui';
import { ChooseChannel } from '@/inbox/channel/components/ChooseChannel';
import { useMultiQueryState } from 'erxes-ui';
import { ChooseIntegrationKind } from '@/integrations/components/ChooseIntegrationKind';

export const InboxMainFilter = () => {
  const [, setQueryStates] = useMultiQueryState<{
    assignedToMe: boolean;
    detailView: boolean;
  }>(['assignedToMe', 'detailView']);

  return (
    <ScrollArea className="h-full" viewportClassName="block-child">
      <Collapsible
        className="group/collapsible flex flex-col gap-1 py-4 px-2 w-full overflow-x-hidden"
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
          <ChooseIntegrationKind />
        </Collapsible.Content>
      </Collapsible>
    </ScrollArea>
  );
};
