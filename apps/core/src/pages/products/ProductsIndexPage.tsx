import { AddProductButton } from '@/products/components/HeaderAddProductsButton/AddProductButton';
import { ProductsRecordTable } from '@/products/components/ProductsRecordTable';
import {
  IconAdjustmentsHorizontal,
  IconBox,
  IconPlus,
  IconSettings,
} from '@tabler/icons-react';
import { Button, Sheet } from 'erxes-ui/components';
import { PluginHeader } from 'erxes-ui/modules/plugin-header/PluginHeader';

export const ProductsIndexPage = () => {
  return (
    <div className="flex flex-col h-full p-3 pt-0">
      <PluginHeader title="Products & services" icon={IconBox}>
        <Button variant="outline" className="px-2">
          <IconSettings className="w-4 h-4" />
          Go to settings
        </Button>
        <Button variant="outline" className="px-2">
          <IconAdjustmentsHorizontal className="w-4 h-4" />
          Filter
        </Button>
        <AddProductButton />
        <Sheet>
          <Sheet.Trigger>
            <Button>
              <IconPlus className="w-4 h-4" />
              Add product
            </Button>
          </Sheet.Trigger>
          <Sheet.Content className="sm:max-w-2xl">hi</Sheet.Content>
        </Sheet>
      </PluginHeader>

      <ProductsRecordTable />
    </div>
  );
};
