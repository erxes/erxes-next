import { CellContext } from '@tanstack/react-table';
import { ProductT } from '@/products/types/productTypes';
import { ProductTypeIcon } from '@/products/components/ProductTypeIcon';

export function ProductTypeCell(info: CellContext<ProductT, any>) {
  return <ProductTypeIcon {...info} />;
}
