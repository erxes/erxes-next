import { ProductCategoriesHeader } from '@/products/product-category/components/ProductCategoriesHeader';
import { ProductCategoriesRecordTable } from '@/products/product-category/components/ProductCategoriesRecordTable';

export const ProductCategoryPage = () => {
  return (
    <div className="flex flex-col h-full pt-0">
      <ProductCategoriesHeader />
      <ProductCategoriesRecordTable />
    </div>
  );
};
