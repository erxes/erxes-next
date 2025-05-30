import { IconPlus } from '@tabler/icons-react';
import { Button, Sheet } from 'erxes-ui';
import { IntegrationSteps } from '@/integrations/components/IntegrationSteps';

export const AddErxesMessengerSheet = () => {
  return (
    <Sheet>
      <Sheet.Trigger asChild>
        <Button>
          <IconPlus />
          Add Messenger
        </Button>
      </Sheet.Trigger>
      <Sheet.View className="gap-0 flex-col flex">
        <Sheet.Header>
          <Sheet.Title>Add Erxes Messenger</Sheet.Title>
          <Sheet.Close />
        </Sheet.Header>
        <Sheet.Content className="grow">
          <IntegrationSteps
            step={1}
            title="Add Erxes Messenger"
            stepsLength={3}
            description="Add Erxes Messenger to your website"
          />
        </Sheet.Content>
        <Sheet.Footer>
          <Button>Add</Button>
        </Sheet.Footer>
      </Sheet.View>
    </Sheet>
  );
};
