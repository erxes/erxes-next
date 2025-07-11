import { IconAdjustmentsHorizontal } from '@tabler/icons-react';
import { Button, Label, Popover, Select } from 'erxes-ui';

export const NotificationAdjustments = () => {
  return (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="ghost" size="icon">
          <IconAdjustmentsHorizontal className="size-4" />
        </Button>
      </Popover.Trigger>
      <Popover.Content>
        <div className="flex flex-row justify-between">
          <Label>Ordering</Label>
          <Select defaultValue="new">
            <Select.Trigger className="h-4 w-24">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="new">Newest</Select.Item>
              <Select.Item value="old">Oldest</Select.Item>
              <Select.Item value="priority">Priority</Select.Item>
            </Select.Content>
          </Select>
        </div>
      </Popover.Content>
    </Popover>
  );
};
