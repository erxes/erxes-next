import { IconBox, IconSettings, IconPlus } from '@tabler/icons-react';
import { Button, Sheet } from 'erxes-ui/components';
import { PluginHeader } from 'erxes-ui/modules/plugin-header/PluginHeader';
import { AddProductButton } from './HeaderAddProductsButton/AddProductButton';
import { FilterBarWithHook } from 'erxes-ui/modules/filter/componets/FilterBarWithHook';
import { filters } from './ProductsFilter';
import { FilterDropdown } from 'erxes-ui/modules/filter/componets/FilterDropdown';

export const ProductsHeader = () => {
  return (
    <>
      <PluginHeader title="Products & services" icon={IconBox}>
        <Button variant="outline" className="px-2">
          <IconSettings className="w-4 h-4" />
          Go to settings
        </Button>
        <FilterDropdown filters={filters} />
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
    </>
  );
};
