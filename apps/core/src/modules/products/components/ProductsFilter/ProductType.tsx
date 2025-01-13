import { useAddFilter } from '@/products/hooks/useAddFilter';
import { IconChevronLeft } from '@tabler/icons-react';
import { DropdownMenu } from 'erxes-ui/components';
import { filters } from '@/products/components/ProductsFilter';

export const ProductType = () => {
  const { filter, setFilter } = useAddFilter('type');

  return (
    <DropdownMenu.TabsContent value="type">
      <DropdownMenu.TabsTrigger value="root">
        <IconChevronLeft className="w-4 h-4 mr-2" />
        Type
      </DropdownMenu.TabsTrigger>
      <DropdownMenu.RadioGroup value={filter} onValueChange={setFilter}>
        {filters.type.options.map((option) => (
          <DropdownMenu.RadioItem value={option.value}>
            {option.label}
          </DropdownMenu.RadioItem>
        ))}
      </DropdownMenu.RadioGroup>
    </DropdownMenu.TabsContent>
  );
};
