import {
  IconCaretDownFilled,
  IconUsers,
  IconUserUp,
} from '@tabler/icons-react';
import { Button, Collapsible } from 'erxes-ui/components';
import { ChooseChannel } from '@/channels/components/ChooseChannel';

export const TeamInboxMenu = () => {
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
        <Button variant="ghost" className="w-full justify-start">
          <IconUsers className="text-accent-foreground" />
          Team Inbox
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <IconUserUp className="text-accent-foreground" />
          Assigned to me
        </Button>
        <ChooseChannel />
      </Collapsible.Content>
    </Collapsible>
  );
};
