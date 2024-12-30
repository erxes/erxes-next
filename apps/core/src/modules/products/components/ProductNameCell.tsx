import { CellContext } from '@tanstack/react-table';
import { ProductT } from '@/products/types/productTypes';
import { Button } from 'erxes-ui';
import { ProductTypeIcon } from './ProductTypeIcon';

export const ProductNameCell = (info: CellContext<ProductT, any>) => {
  return (
    <Button size="sm" variant="link">
      <ProductTypeIcon info={info} />
      {info.getValue() as string}
    </Button>
  );
};
