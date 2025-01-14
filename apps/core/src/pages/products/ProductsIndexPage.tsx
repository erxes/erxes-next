import { ProductsRecordTable } from '@/products/components/ProductsRecordTable';
import { ProductsHeader } from '@/products/components/ProductsHeader';
export const ProductsIndexPage = () => {
  return (
    <div className="flex flex-col h-full p-3 pt-0">
      <ProductsHeader />
      <ProductsRecordTable />
    </div>
  );
};
