import { Cell } from '@tanstack/react-table';
import { RecordTableMoreButton } from 'erxes-ui/modules/record-table/components/MoreColumn';
import { renderingProductDetailAtom } from '../states/productDetailStates';
import { ProductT } from '@/products/types/productTypes';
import { useSetAtom } from 'jotai';
import { useLocation, useNavigate } from 'react-router-dom';

export const ProductMoreColumnCell = ({
  cell,
}: {
  cell: Cell<ProductT, unknown>;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const setRenderingProductDetail = useSetAtom(renderingProductDetailAtom);
  const { _id } = cell.row.original;

  const setOpen = (productId: string) => {
    navigate({
      pathname: location.pathname,
      search: `?product_id=${productId}`,
    });
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
