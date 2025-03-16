import { IconCalendar } from '@tabler/icons-react';
import { DropdownMenu } from 'erxes-ui/components';

export const DropdownFilter = ({ filterId }: { filterId: string }) => {
  return (
    <>
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
      <DropdownMenu.Item>
        <IconCalendar />
        Custom
      </DropdownMenu.Item>
    </>
  );
};
