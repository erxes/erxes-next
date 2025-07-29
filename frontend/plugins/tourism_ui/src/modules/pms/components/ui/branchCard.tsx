import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import {
  IconCalendarEvent,
  IconChevronDown,
  IconChevronUp,
  IconCopy,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react';
import { Avatar, DropdownMenu } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib';
import { useState } from 'react';

const BranchCard = () => {
  const [open, setOpen] = useState<boolean>(false);

  const dropdownItems = [
    {
      label: 'Manage',
      icon: <IconEdit className="size-4" stroke={2} />,
      //onClick: () => ...
    },
    {
      label: 'Duplicate',
      icon: <IconCopy className="size-4" />,
    },
    {
      label: 'Delete',
      icon: <IconTrash className="size-4" />,
    },
  ];

  return (
    <div className="h-fit rounded-md max-w-2xl shadow-md border">
      <div className="p-3 flex justify-between gap-4">
        <h3>New pms branch</h3>

        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenu.Trigger className="flex items-center gap-1">
            Action
            <IconChevronUp
              className={cn(
                open ? '' : 'rotate-180',
                'size-4 transition-all duration-150',
              )}
            />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="min-w-[150px]">
            {dropdownItems.map((item) => (
              <DropdownMenu.Item className="flex gap-2 items-center">
                {item.icon} {item.label}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>

      <div className="h-full max-h-[150px] overflow-hidden">
        <img
          src="https://particle.scitech.org.au/wp-content/uploads/2022/12/GettyImages-1203853320-scaled.jpg"
          alt=""
          className="w-full h-full"
        />
      </div>

      <div className="p-3 flex justify-between items-center">
        <p className="flex gap-1">
          <IconCalendarEvent className="size-4" />
          Created on: Jan 25, 2025
        </p>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};
export default BranchCard;
