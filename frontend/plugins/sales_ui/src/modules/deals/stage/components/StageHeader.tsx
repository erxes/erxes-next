import { Button, DropdownMenu, Sheet } from 'erxes-ui';
import { IconDots, IconPlus } from '@tabler/icons-react';

import { AddCustomerForm } from '../../cards/AddCardForm';
import { useState } from 'react';

type Props = {
  stage: any;
};

export const StageHeader = ({ stage }: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="flex justify-between items-center">
      <h4>{stage.title}</h4>
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <IconDots className="cursor-pointer p-1 transition-all duration-300 hover:bg-white rounded-sm" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="w-56">
            <DropdownMenu.Label>Stage section</DropdownMenu.Label>
            <DropdownMenu.Separator />
            <DropdownMenu.Group>
              <DropdownMenu.Item>
                Archive All Cards in This List
                <DropdownMenu.Shortcut>⇧⌘A</DropdownMenu.Shortcut>
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                Archive This List
                <DropdownMenu.Shortcut>⌘B</DropdownMenu.Shortcut>
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                Remove stage
                <DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
              </DropdownMenu.Item>
            </DropdownMenu.Group>
            <DropdownMenu.Separator />
            <DropdownMenu.Group>
              <DropdownMenu.Item>Sort By</DropdownMenu.Item>
              <DropdownMenu.Item>
                Print Document
                <DropdownMenu.Shortcut>⌘+T</DropdownMenu.Shortcut>
              </DropdownMenu.Item>
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu>
        <Sheet
          open={open}
          onOpenChange={(open) => (open ? setOpen(true) : setOpen(false))}
        >
          <Sheet.Trigger asChild>
            <IconPlus className="cursor-pointer p-1 transition-all duration-300 hover:bg-white rounded-sm" />
          </Sheet.Trigger>
          <Sheet.View
            className="sm:max-w-lg p-0"
            onEscapeKeyDown={(e) => {
              e.preventDefault();
            }}
          >
            <AddCustomerForm onOpenChange={setOpen} />
          </Sheet.View>
        </Sheet>
      </div>
    </div>
  );
};
