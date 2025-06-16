import { DropdownMenu, Sheet } from 'erxes-ui';
import { IconDots, IconPlus } from '@tabler/icons-react';

import { AddCardForm } from '@/deals/cards/components/AddCardForm';
import { IStage } from '@/deals/types/stages';
import { useState } from 'react';

type Props = {
  stage: IStage;
};

export const StageHeader = ({ stage = {} as IStage }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { probability, itemsTotalCount, name } = stage;

  return (
    <div className="flex justify-between items-center">
      <div>
        <h4 className="font-semibold flex items-center gap-2">
          {name}
          <span className="text-xs text-gray-400">{itemsTotalCount || 0}</span>
        </h4>
        {probability && (
          <span className="text-xs text-gray-400">
            Forecasted ({probability})
          </span>
        )}
      </div>
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
        <Sheet open={open} onOpenChange={setOpen}>
          <Sheet.Trigger
            asChild
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
          >
            <IconPlus className="cursor-pointer p-1 transition-all duration-300 hover:bg-white rounded-sm" />
          </Sheet.Trigger>
          <Sheet.View
            className="sm:max-w-lg p-0"
            onEscapeKeyDown={(e) => {
              e.preventDefault();
            }}
          >
            <AddCardForm />
          </Sheet.View>
        </Sheet>
      </div>
    </div>
  );
};
