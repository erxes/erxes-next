import { ProductsHeader } from '@/products/components/ProductsHeader';
import { useSearchParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import { ProductDetail } from '@/products/detail/components/ProductDetail';
import { renderingProductDetailAtom } from '@/products/states/productDetailStates';
import { ProductsRecordTable } from '@/products/components/ProductsRecordTable';

export const ProductsIndexPage = () => {
  const [renderingProductDetail] = useAtom(renderingProductDetailAtom);
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('product_id');

  return (
    <div className="flex flex-col h-full p-3 pt-0">
      <ProductsHeader />
      {!(renderingProductDetail && productId) && <ProductsRecordTable />}
      <ProductDetail />
    </div>
  );
};