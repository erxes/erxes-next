import { IconPlus } from '@tabler/icons-react';
import { Button, Sheet } from 'erxes-ui';

export const AddErxesMessengerSheet = () => {
  return (
    <Sheet>
      <Sheet.Trigger asChild>
        <Button>
          <IconPlus />
          Add Messenger
        </Button>
      </Sheet.Trigger>
      <Sheet.View className="gap-0">
        <Sheet.Header>
          <Sheet.Title>Add Erxes Messenger</Sheet.Title>
          <Sheet.Close />
        </Sheet.Header>
        <Sheet.Content className="grow">hi</Sheet.Content>
      </Sheet.View>
    </Sheet>
  );
};
