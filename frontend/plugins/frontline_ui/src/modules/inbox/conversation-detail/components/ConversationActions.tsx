import { IconChevronDown } from '@tabler/icons-react';
import { Button, DropdownMenu } from 'erxes-ui';

export const ConversationActions = () => {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button className="flex-none pr-2" variant="outline">
          Actions <IconChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>Resolve</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
