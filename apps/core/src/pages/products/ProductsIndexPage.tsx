import { AddProductForm } from '@/products/components/HeaderAddProductsButton/AddProductForm';
import { ProductsRecordTable } from '@/products/components/ProductsRecordTable';
import {
  IconAdjustmentsHorizontal,
  IconBox,
  IconSettings,
} from '@tabler/icons-react';
import { Button } from 'erxes-ui/components';
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
        <AddProductForm />
      </PluginHeader>
      <ProductsRecordTable />
    </div>
  );
};
