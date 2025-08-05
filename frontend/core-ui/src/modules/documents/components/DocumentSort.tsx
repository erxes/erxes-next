import { IconSortDescending2Filled } from '@tabler/icons-react';
import { Button, Combobox, Command, Popover } from 'erxes-ui';

export const DocumentSort = () => {
  return (
    <>
      <Popover>
        <Popover.Trigger asChild>
          <Button variant="ghost">
            <IconSortDescending2Filled className="w-4 h-4" />
          </Button>
        </Popover.Trigger>

        <Combobox.Content>
          <Command>
            <Command.List className="p-1">
              <Command.Item>Newest First</Command.Item>
              <Command.Item>Oldest First</Command.Item>
            </Command.List>
          </Command>
        </Combobox.Content>
      </Popover>
    </>
  );
};
