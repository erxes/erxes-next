import { IconUserFilled, IconUserUp } from '@tabler/icons-react';
import { Button, ScrollArea } from 'erxes-ui';
import { ChooseChannel } from '@/inbox/channel/components/ChooseChannel';
import { ChooseIntegrationType } from '@/integrations/components/ChooseIntegrationType';
import { selectMainFilterState } from '@/inbox/states/inboxLayoutState';
import { useSetAtom } from 'jotai';
import { useQueryState } from 'erxes-ui';

export const InboxMainFilter = () => {
  const selectMainFilter = useSetAtom(selectMainFilterState);
  const [, setAssignedToMe] = useQueryState('assignedToMe');
  return (
    <ScrollArea className="h-full" viewportClassName="block-child">
      <div className="p-4 flex flex-col gap-1">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => selectMainFilter()}
        >
          <IconUserFilled className="text-accent-foreground" />
          Team Inbox
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => {
            setAssignedToMe(true);
            selectMainFilter();
          }}
        >
          <IconUserUp className="text-accent-foreground" />
          Assigned to me
        </Button>
        <ChooseChannel />
        <ChooseIntegrationType />
      </div>
    </ScrollArea>
  );
};
