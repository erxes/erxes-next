import {
  IconEdit,
  IconCopy,
  IconWorld,
  IconTrash,
  IconChevronDown,
} from '@tabler/icons-react';
import { Popover } from 'erxes-ui';

interface ActionMenuProps {
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  duplicateLoading: boolean;
}

export const ActionMenu = ({
  onEdit,
  onDuplicate,
  onDelete,
  duplicateLoading,
}: ActionMenuProps) => {
  return (
    <Popover>
      <Popover.Trigger asChild>
        <button className="flex items-center leading-[100%] text-foreground font-inter gap-1 text-sm font-medium rounded-md px-1">
          Action
          <IconChevronDown size={18} stroke={2} />
        </button>
      </Popover.Trigger>
      <Popover.Content
        className="p-1 w-48 rounded-lg border shadow-lg bg-background"
        side="bottom"
        align="end"
      >
        <div
          className="flex gap-3 items-center px-4 py-2 w-full text-left rounded-md cursor-pointer hover:bg-muted"
          onClick={onEdit}
        >
          <IconEdit size={16} stroke={1.5} />
          <p className="text-sm font-medium leading-[100%] font-inter">Edit</p>
        </div>

        <div
          className={`flex items-center w-full gap-3 px-4 py-2 text-left cursor-pointer hover:bg-muted rounded-md ${
            duplicateLoading ? 'opacity-50 pointer-events-none' : ''
          }`}
          onClick={() => !duplicateLoading && onDuplicate()}
        >
          <IconCopy size={16} stroke={1.5} />
          <p className="text-sm font-medium leading-[100%] font-inter">
            {duplicateLoading ? 'Duplicating...' : 'Duplicate'}
          </p>
        </div>

        <div className="flex gap-3 items-center px-4 py-2 w-full text-left rounded-md cursor-pointer hover:bg-muted">
          <IconWorld size={16} stroke={1.5} />
          <p className="text-sm font-medium leading-[100%] font-inter">
            Visit website
          </p>
        </div>

        <div
          className="flex gap-3 items-center px-4 py-2 w-full text-left rounded-md cursor-pointer hover:bg-destructive/10 text-destructive"
          onClick={onDelete}
        >
          <IconTrash size={16} stroke={1.5} />
          <p className="text-sm font-medium leading-[100%] font-inter">
            Delete
          </p>
        </div>
      </Popover.Content>
    </Popover>
  );
};
