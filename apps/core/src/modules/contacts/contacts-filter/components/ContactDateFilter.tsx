import { Button, DropdownMenu } from 'erxes-ui/components';
import { useQueryState } from 'nuqs';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { contactDateFilterOpenAtom } from '@/contacts/contacts-filter/states/contactStates';
import { IconCalendarPlus } from '@tabler/icons-react';
import { DateFilter } from 'erxes-ui/modules/date-filter/components/date-filter';
import { getDateLabel } from 'erxes-ui/modules/date-filter/utlis/getDateLabel';

export const ContactDateFilterDropdown = () => {
  const [filter, setFilter] = useQueryState('date');
  const setOpen = useSetRecoilState(contactDateFilterOpenAtom);
  return (
    <>
      <DropdownMenu.RadioGroup value={filter || ''} onValueChange={setFilter}>
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
      <DropdownMenu.Separator />
      <DropdownMenu.Item
        onClick={() => {
          setTimeout(() => setOpen(true));
        }}
      >
        <IconCalendarPlus /> Custom date
      </DropdownMenu.Item>
    </>
  );
};

export const ContactDateFilter = () => {
  const [filter] = useQueryState('date');
  const setOpen = useSetRecoilState(contactDateFilterOpenAtom);
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="ghost"
        className="bg-background rounded-none"
      >
        {getDateLabel(filter || '')}
      </Button>
    </>
  );
};

export const ContactDateFilterDialog = () => {
  const [open, setOpen] = useRecoilState(contactDateFilterOpenAtom);
  const [date, setDate] = useQueryState('date');
  return (
    <DateFilter
      open={open}
      onOpenChange={setOpen}
      value={date || ''}
      onValueChange={setDate}
    />
  );
};
