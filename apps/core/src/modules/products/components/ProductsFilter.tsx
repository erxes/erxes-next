import { IconBox, IconRosetteDiscountCheck } from '@tabler/icons-react';

import { Filter } from 'erxes-ui/modules/filter/types/filter';

import {
  ProductBrandFilterBar,
  ProductBrandFilterDropdown,
} from '@/products/products-filter/components/ProductBrandFilter';
import {
  ProductTypeFilterBar,
  ProductTypeFilterDropdown,
} from '@/products/products-filter/components/ProductTypeFilter';

export const filters: Filter[] = [
  {
    label: 'Type',
    accessoryKey: 'type',
    icon: IconBox,
    condition: (prps) => <></>,
    dropdown: (props) => <ProductTypeFilterDropdown {...props} />,
    bar: () => <ProductTypeFilterBar />,
  },
  {
    label: 'Brand',
    accessoryKey: 'brand',
    icon: IconRosetteDiscountCheck,
    condition: (prps) => <></>,
    dropdown: (props) => <ProductBrandFilterDropdown {...props} />,
    bar: () => <ProductBrandFilterBar />,
  },
];
