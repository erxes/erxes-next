import { useQueryState } from 'nuqs';

import { DropdownMenu, Select } from 'erxes-ui/components';
import { FilterBar } from 'erxes-ui';
import {
  FilterBarComponentPropsBase,
  FilterDropdownProps,
} from 'erxes-ui/modules/filter/types/filter';

const options = [
  { label: 'Customer', value: 'customer' },
  { label: 'Company', value: 'company' },
];

export const ContactTypeFilterDropdown = ({
  accessoryKey,
}: FilterDropdownProps) => {
  const [filter, setFilter] = useQueryState(accessoryKey);
  return (
    <>
      <DropdownMenu.RadioGroup value={filter || ''} onValueChange={setFilter}>
        {options.map((option) => (
          <DropdownMenu.RadioItem value={option.value} key={option.value}>
            {option.label}
          </DropdownMenu.RadioItem>
        ))}
      </DropdownMenu.RadioGroup>
    </>
  );
};

export const ContactTypeFilterBar = ({
  accessoryKey,
}: FilterBarComponentPropsBase) => {
  const [filter, setFilter] = useQueryState(accessoryKey);
  return (
    <Select value={filter || ''} onValueChange={setFilter}>
      <FilterBar.SelectTrigger>
        <Select.Value placeholder="Select type" />
      </FilterBar.SelectTrigger>
      <Select.Content>
        {options.map((option) => (
          <Select.Item value={option.value}>{option.label}</Select.Item>
        ))}
      </Select.Content>
    </Select>
  );
};
