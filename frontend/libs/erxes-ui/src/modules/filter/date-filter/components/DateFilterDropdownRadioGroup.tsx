import { DropdownMenu } from 'erxes-ui/components';

export const DateFilterRadioGroup = () => {
  return (
    <DropdownMenu.RadioGroup>
      <DropdownMenu.RadioItem value="today">Today</DropdownMenu.RadioItem>
      <DropdownMenu.RadioItem value="yesterday">
        Yesterday
      </DropdownMenu.RadioItem>
      <DropdownMenu.RadioItem value="last7Days">
        Last 7 Days
      </DropdownMenu.RadioItem>
      <DropdownMenu.RadioItem value="last30Days">
        Last 30 Days
      </DropdownMenu.RadioItem>
    </DropdownMenu.RadioGroup>
  );
};
