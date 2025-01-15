import { DropdownMenu, Select } from 'erxes-ui/components';
import { FilterBar } from 'erxes-ui/modules/filter';
import { useQueryState } from 'nuqs';

const options = [
  { label: 'Person', value: 'person' },
  { label: 'Company', value: 'company' },
];

export const ContactTypeFilterDropdown = ({ onOpenChange }: any) => {
  const [filter, setFilter] = useQueryState('type');
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

export const ContactTypeFilterBar = () => {
  const [filter, setFilter] = useQueryState('type');
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
