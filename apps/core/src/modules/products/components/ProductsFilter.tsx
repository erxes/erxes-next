import { IconBox, IconRosetteDiscountCheck } from '@tabler/icons-react';
import {
  ProductTypeFilterBar,
  ProductTypeFilterDropdown,
} from '@/products/products-filter/components/ProductTypeFilter';
import {
  ProductBrandFilterBar,
  ProductBrandFilterDropdown,
} from '@/products/products-filter/components/ProductBrandFilter';
import { Filter } from 'erxes-ui/modules/filter/types/filter';

export const filters: Filter[] = [
  {
    label: 'Type',
    accessoryKey: 'type',
    icon: IconBox,
    type: 'select',
    condition: 'is',
    dropdown: (props) => <ProductTypeFilterDropdown {...props} />,
    bar: () => <ProductTypeFilterBar />,
  },
  {
    label: 'Brand',
    accessoryKey: 'brand',
    icon: IconRosetteDiscountCheck,
    type: 'select',
    condition: 'is',
    dropdown: (props) => <ProductBrandFilterDropdown {...props} />,
    bar: () => <ProductBrandFilterBar />,
  },
];
