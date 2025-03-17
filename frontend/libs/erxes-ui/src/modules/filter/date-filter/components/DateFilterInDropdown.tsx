import { IconCalendar } from '@tabler/icons-react';
import { DropdownMenu } from 'erxes-ui/components';
import { useState } from 'react';

export const DateFilterInDropdown = ({
  filterId,
  renderDateFilter,
  value,
  onValueChange,
}: {
  filterId: string;
  renderDateFilter: ({
    open,
    setOpen,
  }: {
    open: boolean;
    setOpen: (open: boolean) => void;
  }) => React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <DropdownMenu.Label>Date</DropdownMenu.Label>
      <DropdownMenu.RadioGroup value={value} onValueChange={onValueChange}>
        <DropdownMenu.RadioItem value="today">Today</DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem value="yesterday">
          Yesterday
        </DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem value="last-7-days">
          Last 7 days
        </DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem value="last-30-days">
          Last 30 days
        </DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem value="thisWeek">
          This week
        </DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem value="thisMonth">
          This month
        </DropdownMenu.RadioItem>
      </DropdownMenu.RadioGroup>
      <DropdownMenu.Separator />
      <DropdownMenu.Item
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        <IconCalendar />
        Custom
      </DropdownMenu.Item>
      {renderDateFilter({ open, setOpen })}
    </>
  );
};
