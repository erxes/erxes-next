import { AddProductButton } from '@/products/components/HeaderAddProductsButton/AddProductButton';
import { filters, ProductsFilter } from '@/products/components/ProductsFilter';
import { ProductsRecordTable } from '@/products/components/ProductsRecordTable';
import { IconBox, IconPlus, IconSettings } from '@tabler/icons-react';
import { Button, Sheet } from 'erxes-ui/components';
import { PluginHeader } from 'erxes-ui/modules/plugin-header/PluginHeader';
import { FilterBarWithHook } from 'erxes-ui/modules/filter-bar/componets/FilterBarWithHook';

export const ProductsIndexPage = () => {
  return (
    <div className="flex flex-col h-full p-3 pt-0">
      <PluginHeader title="Products & services" icon={IconBox}>
        <Button variant="outline" className="px-2">
          <IconSettings className="w-4 h-4" />
          Go to settings
        </Button>
        <ProductsFilter />
        <AddProductButton />
        <Sheet>
          <Sheet.Trigger asChild>
            <Button>
              <IconPlus className="w-4 h-4" />
              Add product
            </Button>
          </Sheet.Trigger>
          <Sheet.Content className="sm:max-w-2xl">hi</Sheet.Content>
        </Sheet>
      </PluginHeader>
      <FilterBarWithHook filters={filters} />
      <ProductsRecordTable />
    </div>
  );
};
