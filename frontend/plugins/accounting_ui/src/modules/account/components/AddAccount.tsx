import { IconPlus } from '@tabler/icons-react';
import { Button, Sheet } from 'erxes-ui';

export const AddAccount = () => {
  return (
    <Sheet>
      <Sheet.Trigger asChild>
        <Button>
          <IconPlus />
          Add Account
        </Button>
      </Sheet.Trigger>
      <Sheet.Content>
        <Sheet.Header>
          <Sheet.Title>Add Account</Sheet.Title>
        </Sheet.Header>
      </Sheet.Content>
    </Sheet>
  );
};
