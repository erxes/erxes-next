import ProductsHeader from '@/products/components/ProductsHeader';
import ExampleTwo from '@/products/components/ExampleTwo';

export const ProductsIndexPage = () => {
  return (
    <div className="flex flex-col h-full">
      <ProductsHeader />
      <ExampleTwo />
    </div>
  );
};
