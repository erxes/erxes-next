import { ProductsHeader } from '@/products/components/ProductsHeader';
import { ProductDetail } from '@/products/detail/components/ProductDetail';
import { ProductsRecordTable } from '@/products/components/ProductsRecordTable';
import { ProductsFilter } from '@/products/components/ProductsFilter';

export const ProductsIndexPage = () => {
  return (
    <div className="flex flex-col h-full pt-0">
      <ProductsHeader />
      <ProductsFilter />
      <ProductsRecordTable />
      <ProductDetail />
    </div>
  );
};
