import {
  IconAdjustmentsHorizontal,
  IconChevronRight,
} from '@tabler/icons-react';
import { Button, DropdownMenu } from 'erxes-ui/components';
import { ProductType } from './ProductsFilter/ProductType';

export const filters = {
  type: {
    label: 'Type',
    value: 'type',
    type: 'select',
    options: [
      { label: 'All', value: '' },
      { label: 'Product', value: 'product' },
      { label: 'Service', value: 'service' },
      { label: 'Subscription', value: 'subscription' },
      { label: 'Inventory', value: 'inventory' },
    ],
  },
};

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
            <DropdownMenu.TabsTrigger value="type">
              Type
              <IconChevronRight className="w-4 h-4 ml-auto" />
            </DropdownMenu.TabsTrigger>
          </DropdownMenu.TabsContent>
          <ProductType />
        </DropdownMenu.Tabs>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
