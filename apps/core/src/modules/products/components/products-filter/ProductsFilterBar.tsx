import { FilterBar } from 'erxes-ui/modules/filter-bar';
import { ProductFilterBarItem } from './ProductFilterBarItem';

export const ProductsFilterBar = () => {
  return (
    <FilterBar.Container>
      <ProductFilterBarItem />
    </FilterBar.Container>
  );
};
