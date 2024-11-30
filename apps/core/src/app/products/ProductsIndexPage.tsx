// import Example from '@/products/components/Example';
import ProductsHeader from '@/products/components/ProductsHeader';
// import { ProductsList } from '@/products/components/ProductsList';
import { ProductsRecordTable } from '@/products/components/ProductsRecordTable';
// import ExampleThree from '@/products/components/ExampleThree';

export const ProductsIndexPage = () => {
  return (
    <div className="flex flex-col h-full p-3 pt-0">
      <ProductsHeader />
      <ProductsRecordTable />
      {/* <ProductsList /> */}
      {/* <ExampleTwo /> */}
      {/* <ExampleThree /> */}
    </div>
  );
};
