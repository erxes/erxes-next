import Example from '@/products/components/Example';
import ProductsHeader from '@/products/components/ProductsHeader';
import { ProductsList } from '@/products/components/ProductsList';
import ExampleTwo from '@/products/components/ExampleTwo';

export const ProductsIndexPage = () => {
  return (
    <div className="flex flex-col h-full">
      <ProductsHeader />
      {/* <ProductsList /> */}
      <ExampleTwo />
    </div>
  );
};
