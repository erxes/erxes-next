import { IconCalendarPlus } from '@tabler/icons-react';
import { useAtom, useSetAtom } from 'jotai';
import {
  Button,
  DropdownMenu,
  Select,
  FilterBar,
  DateFilter,
  FilterDropdownProps,
  useQueryState,
  FilterBarComponentPropsBase,
} from 'erxes-ui';

import { contactsFilters } from '@/contacts/components/filters';
import { contactDateFilterOpenAtom } from '@/contacts/contacts-filter/states/contactStates';

export const ContactDateFilterDropdown = ({
  accessoryKey,
}: FilterDropdownProps) => {
  const [date, setDate] = useQueryState<string>(accessoryKey);
  const setOpen = useSetAtom(contactDateFilterOpenAtom);
  return (
    <>
      <DropdownMenu.RadioGroup value={date || ''} onValueChange={setDate}>
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
  const [date] = useQueryState<string>(accessoryKey);
  const setOpen = useSetAtom(contactDateFilterOpenAtom);
  return (
    <Button
      onClick={() => setOpen(accessoryKey)}
      variant="ghost"
      className="bg-background rounded-none"
    >
      {/* {getDateLabel(date)} */}
    </Button>
  );
};

export const ContactDateFilterDialog = () => {
  const [open, setOpen] = useAtom(contactDateFilterOpenAtom);
  const [date, setDate] = useQueryState<string>(open);
  return (
    <DateFilter
      open={!!open}
      onOpenChange={() => setOpen('')}
      value={date || ''}
      onValueChange={setDate}
      label={contactsFilters.find((f) => f.accessoryKey === open)?.label}
    />
  );
};

export const ContactDateFilterConditions = ({
  accessoryKey,
}: FilterBarComponentPropsBase) => {
  const [condition, setCondition] = useQueryState<string>(accessoryKey);

  return (
    <Select value={condition || ''} onValueChange={setCondition}>
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
