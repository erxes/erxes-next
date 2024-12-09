import { CellContext } from '@tanstack/react-table';
import { ProductT } from '@/products/types/productTypes';

export const CategoryCell = (info: CellContext<ProductT, any>) => {
  return <div>{info.getValue()}</div>;
};
