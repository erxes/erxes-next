import { IconCalendarPlus } from '@tabler/icons-react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { Button, DropdownMenu, Select } from 'erxes-ui/components';
import { FilterBar } from 'erxes-ui/modules/filter';
import { DateFilter } from 'erxes-ui/modules/filter/date-filter/components/date-filter';
import { useFilterDateState } from 'erxes-ui/modules/filter/date-filter/hooks/useFilterDateState';
import { getDateLabel } from 'erxes-ui/modules/filter/date-filter/utlis/getDateLabel';
import {
  FilterBarComponentPropsBase,
  FilterDropdownProps,
} from 'erxes-ui/modules/filter/types/filter';

import { contactsFilters } from '@/contacts/components/filters';
import { contactDateFilterOpenAtom } from '@/contacts/contacts-filter/states/contactStates';

export const ContactDateFilterDropdown = ({
  accessoryKey,
}: FilterDropdownProps) => {
  const { stringDate, setDate } = useFilterDateState(accessoryKey);
  const setOpen = useSetRecoilState(contactDateFilterOpenAtom);
  return (
    <>
      <DropdownMenu.RadioGroup value={stringDate || ''} onValueChange={setDate}>
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
          setTimeout(() => setOpen(accessoryKey));
        }}
      >
        <IconCalendarPlus /> Custom date
      </DropdownMenu.Item>
    </>
  );
};

export const ContactDateFilter = ({
  accessoryKey,
}: FilterBarComponentPropsBase) => {
  const { stringDate } = useFilterDateState(accessoryKey);

  const setOpen = useSetRecoilState(contactDateFilterOpenAtom);
  return (
    <Button
      onClick={() => setOpen(accessoryKey)}
      variant="ghost"
      className="bg-background rounded-none"
    >
      {getDateLabel(stringDate)}
    </Button>
  );
};

export const ContactDateFilterDialog = () => {
  const [open, setOpen] = useRecoilState(contactDateFilterOpenAtom);
  const { stringDate, setDate } = useFilterDateState(open);
  return (
    <DateFilter
      open={!!open}
      onOpenChange={() => setOpen('')}
      value={stringDate}
      onValueChange={setDate}
      label={contactsFilters.find((f) => f.accessoryKey === open)?.label}
    />
  );
};

export const ContactDateFilterConditions = ({
  accessoryKey,
}: FilterBarComponentPropsBase) => {
  const { condition, setCondition } = useFilterDateState(accessoryKey);

  return (
    <Select value={condition} onValueChange={setCondition}>
      <FilterBar.SelectTrigger>
        <Select.Value />
      </FilterBar.SelectTrigger>
      <Select.Content>
        <Select.Item value="in">in</Select.Item>
        <Select.Item value="before">before</Select.Item>
        <Select.Item value="after">after</Select.Item>
      </Select.Content>
    </Select>
  );
};
