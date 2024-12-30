import ProductsHeader from '@/products/components/ProductsHeader';
import { ProductsRecordTable } from '@/products/components/ProductsRecordTable';

export const ProductsIndexPage = () => {
  return (
    <div className="flex flex-col h-full p-3 pt-0">
      <ProductsHeader />
      <ProductsRecordTable />
    </div>
  );
};
