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
