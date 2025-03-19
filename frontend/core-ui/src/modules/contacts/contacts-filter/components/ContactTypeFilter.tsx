import {
  DropdownMenu,
  Select,
  FilterBar,
  FilterBarComponentPropsBase,
  FilterDropdownProps,
  useQueryState,
} from 'erxes-ui';

const options = [
  { label: 'Customer', value: 'customer' },
  { label: 'Company', value: 'company' },
];

export const ContactTypeFilterDropdown = ({
  accessoryKey,
}: FilterDropdownProps) => {
  const [filter, setFilter] = useQueryState<string>(accessoryKey);
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
  const [filter, setFilter] = useQueryState<string>(accessoryKey);
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
