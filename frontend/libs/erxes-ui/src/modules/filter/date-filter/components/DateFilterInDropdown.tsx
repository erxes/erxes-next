import { IconCalendar } from '@tabler/icons-react';
import { DropdownMenu } from 'erxes-ui/components';
import { DateFilter } from './DateFilter';
import { useState } from 'react';

export const DateFilterInDropdown = ({ filterId }: { filterId: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <DropdownMenu.Label>Date</DropdownMenu.Label>
      <DropdownMenu.RadioGroup>
        <DropdownMenu.RadioItem value="today">Today</DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem value="yesterday">
          Yesterday
        </DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem value="thisWeek">
          This week
        </DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem value="thisMonth">
          This month
        </DropdownMenu.RadioItem>
      </DropdownMenu.RadioGroup>{' '}
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
      <DateFilter open={open} onOpenChange={setOpen} />
    </>
  );
};
