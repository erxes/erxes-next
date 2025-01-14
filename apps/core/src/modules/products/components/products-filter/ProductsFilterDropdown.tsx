import { IconChevronLeft } from '@tabler/icons-react';
import { DropdownMenu } from 'erxes-ui/components';
import { filters } from '@/products/components/ProductsFilter';
import { useQueryState } from 'nuqs';

export const ProductFilterDropdown = () => {
  const [filter, setFilter] = useQueryState('type');
  const typeFilter = filters.find((filter) => filter.accessoryKey === 'type');

  return (
    <>
      <DropdownMenu.TabsTrigger value="root">
        <IconChevronLeft className="w-4 h-4 mr-2" />
        Type
      </DropdownMenu.TabsTrigger>
      <DropdownMenu.RadioGroup value={filter || ''} onValueChange={setFilter}>
        {typeFilter?.options.map((option) => (
          <DropdownMenu.RadioItem value={option.value} key={option.value}>
            {option.label}
          </DropdownMenu.RadioItem>
        ))}
      </DropdownMenu.RadioGroup>
    </>
  );
};
