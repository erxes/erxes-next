import {
  IconAdjustmentsHorizontal,
  IconBox,
  IconChevronRight,
} from '@tabler/icons-react';
import { Button, DropdownMenu } from 'erxes-ui/components';
import { Filter } from 'erxes-ui/modules/filter-bar/types/filter';
import { ProductFilterDropdown } from '@/products/components/products-filter/ProductsFilterDropdown';

export const filters: Filter[] = [
  {
    label: 'Type',
    accessoryKey: 'type',
    icon: IconBox,
    type: 'select',
    condition: 'is',
    options: [
      { label: 'Product', value: 'product' },
      { label: 'Service', value: 'service' },
      { label: 'Subscription', value: 'subscription' },
      { label: 'Inventory', value: 'inventory' },
    ],
  },
  {
    label: 'Status',
    accessoryKey: 'status',
    icon: IconBox,
    type: 'select',
    condition: 'is',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
  },
];

export const ProductsFilter = () => {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline" className="px-2">
          <IconAdjustmentsHorizontal className="w-4 h-4" />
          Filter
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Tabs>
          <DropdownMenu.TabsContent>
            {filters.map((filter) => (
              <DropdownMenu.TabsTrigger value={filter.accessoryKey}>
                {filter.label}
                <IconChevronRight className="w-4 h-4 ml-auto" />
              </DropdownMenu.TabsTrigger>
            ))}
          </DropdownMenu.TabsContent>
          {filters.map((filter) => (
            <DropdownMenu.TabsContent value={filter.accessoryKey}>
              <ProductFilterDropdown />
            </DropdownMenu.TabsContent>
          ))}
        </DropdownMenu.Tabs>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
