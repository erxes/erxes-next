import {
  IconCaretDownFilled,
  IconUsers,
  IconUserUp,
} from '@tabler/icons-react';
import { Button, Collapsible } from 'erxes-ui/components';

export const TeamInboxMenu = () => {
  return (
    <Collapsible className="group/collapsible flex flex-col gap-1 py-4 px-2">
      <Collapsible.Trigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground"
        >
          <IconCaretDownFilled className="data-[state=open]:rotate-180 text-accent-foreground group-data-[state=open]/collapsible:rotate-180 transition-transform duration-200" />
          Team Inbox
        </Button>
      </Collapsible.Trigger>
      <Collapsible.Content className="pl-4 flex flex-col gap-1">
        <Button variant="ghost" className="w-full justify-start">
          <IconUsers className="text-accent-foreground" />
          Team Inbox
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <IconUserUp className="size-4" />
          Assigned to me
        </Button>
      </Collapsible.Content>
    </Collapsible>
  );
};
