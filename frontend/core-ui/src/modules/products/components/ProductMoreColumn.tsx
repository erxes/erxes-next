import { Cell } from '@tanstack/react-table';
import { RecordTableMoreButton } from 'erxes-ui/modules/record-table/components/MoreColumn';
import { renderingProductDetailAtom } from '../states/productDetailStates';
import { ProductT } from '@/products/types/productTypes';
import { useSetAtom } from 'jotai';
import { useSearchParams } from 'react-router-dom';

export const ProductMoreColumnCell = ({
  cell,
}: {
  cell: Cell<ProductT, unknown>;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const setRenderingProductDetail = useSetAtom(renderingProductDetailAtom);
  const { _id } = cell.row.original;

  const setOpen = (productId: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('product_id', productId);
    setSearchParams(newSearchParams);
  };

  return (
    <RecordTableMoreButton
      className="w-full h-full"
      onClick={() => {
        setOpen(_id);
        setRenderingProductDetail(false);
      }}
    />
  );
};

export const productMoreColumn = {
  id: 'more',
  cell: ProductMoreColumnCell,
  size: 33,
};