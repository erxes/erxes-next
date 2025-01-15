import { contactsFilters } from '@/contacts/components/filters';
import { DropdownMenu, Select } from 'erxes-ui/components';
import { FilterBarSelectTrigger } from 'erxes-ui/modules/filter/componets/FilterBar';
import { useQueryState } from 'nuqs';

export const ContactDateFilterDropdown = () => {
  const [filter, setFilter] = useQueryState('date');
  return (
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
  );
};

export const ContactDateFilter = () => {
  const [filter, setFilter] = useQueryState('date');
  return (
    <Select value={filter || ''} onValueChange={setFilter}>
      <FilterBarSelectTrigger>
        <Select.Value />
      </FilterBarSelectTrigger>
      <Select.Content>
        <Select.Item value="today">Today</Select.Item>
        <Select.Item value="yesterday">Yesterday</Select.Item>
        <Select.Item value="last7Days">Last 7 Days</Select.Item>
        <Select.Item value="last30Days">Last 30 Days</Select.Item>
      </Select.Content>
    </Select>
  );
};
