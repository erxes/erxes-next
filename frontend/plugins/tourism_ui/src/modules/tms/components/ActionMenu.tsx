import {
  IconEdit,
  IconCopy,
  IconWorld,
  IconTrash,
  IconChevronDown,
} from '@tabler/icons-react';
import { cn, Popover } from 'erxes-ui';

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
  const dropdownItems = [
    {
      label: 'Edit',
      icon: <IconEdit size={16} stroke={1.5} />,
      onClick: () => onEdit(),
    },
    {
      label: 'Duplicate',
      icon: <IconCopy className="size-4" />,
      onClick: () => onDuplicate(),
    },
    {
      label: 'Visit website',
      icon: <IconWorld size={16} stroke={1.5} />,
    },
    {
      label: 'Delete',
      icon: <IconTrash size={16} stroke={1.5} />,
      onClick: () => onDelete(),
    },
  ];

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
        {dropdownItems.map((item) => (
          <div
            className="flex gap-3 items-center px-4 py-2 w-full text-left rounded-md cursor-pointer hover:bg-muted"
            onClick={item.onClick}
          >
            {item.icon}
            <p className="text-sm font-medium leading-[100%] font-inter">
              {item.label}
            </p>
          </div>
        ))}
      </Popover.Content>
    </Popover>
  );
};
