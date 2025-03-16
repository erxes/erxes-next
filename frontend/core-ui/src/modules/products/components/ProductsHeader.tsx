import { IconBox, IconSettings } from '@tabler/icons-react';

import { Button } from 'erxes-ui/components';
import { PluginHeader } from 'erxes-ui/modules/plugin-header/PluginHeader';
import { FilterDropdown } from 'erxes-ui';
import { filters } from './ProductsFilter';
import { AddProductForm } from '../add-products/components/AddProductForm';

export const ProductsHeader = () => {
  return (
    <>
      <PluginHeader title="Products & services" icon={IconBox}>
        <Button variant="outline" className="px-2">
          <IconSettings className="w-4 h-4" />
          Go to settings
        </Button>
        <FilterDropdown filters={filters} />

        <AddProductForm />
      </PluginHeader>
      {/* <FilterBarWithHook filters={filters} /> */}
    </>
  );
};
