import { IconDownload } from '@tabler/icons-react';

import {
  IconChevronRight,
  IconTag,
  IconTrash,
  IconUpload,
} from '@tabler/icons-react';

import { IconList } from '@tabler/icons-react';

import { DropdownMenu, Button } from 'erxes-ui/components';

export const MainMenu = ({ handleToMain, handleToFields }) => {
  return (
    <>
      <DropdownMenu.Label className="flex items-center gap-2 p-0">
        <Button
          variant={'ghost'}
          onClick={(e) => {
            handleToMain(e as unknown as React.MouseEvent);
          }}
        >
          <IconList className="w-4 h-4" />
        </Button>
        <span className="text-foreground font-semibold">All</span>
      </DropdownMenu.Label>
      <DropdownMenu.Separator />
      <DropdownMenu.Item
        onSelect={(e) => {
          handleToFields(e as unknown as React.MouseEvent);
        }}
        className="cursor-pointer flex justify-between items-center"
      >
        <div className="relative flex cursor-default select-none items-center gap-2 rounded-sm text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0">
          <IconTag className="w-4 h-4 " />
          <span>Fields</span>
        </div>
        <IconChevronRight className="w-4 h-4" />
      </DropdownMenu.Item>

      <DropdownMenu.Separator className="h-[0.8px]" />
      <DropdownMenu.Item>
        <IconDownload />
        <span>Export</span>
      </DropdownMenu.Item>
      <DropdownMenu.Item>
        <IconUpload />
        <span>Import</span>
      </DropdownMenu.Item>

      <DropdownMenu.Item>
        <IconTrash />
        <span>Deleted opportunities</span>
      </DropdownMenu.Item>
    </>
  );
};
