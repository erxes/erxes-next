import { Cell } from '@tanstack/react-table';
import { IProduct } from '@/products/types/productTypes';
import { useSetAtom } from 'jotai';
import { useSearchParams } from 'react-router-dom';
import { RecordTable } from 'erxes-ui';
import { renderingCategoryDetailAtom } from '../states/ProductCategory';

export const CategoryMoreColumnCell = ({
  cell,
}: {
  cell: Cell<IProduct, unknown>;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const setRenderingProductDetail = useSetAtom(renderingCategoryDetailAtom);
  const { _id } = cell.row.original;

  const setOpen = (categoryId: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('category_id', categoryId);
    setSearchParams(newSearchParams);
  };

  return (
    <RecordTable.MoreButton
      className="w-full h-full"
      onClick={() => {
        setOpen(_id);
        setRenderingProductDetail(false);
      }}
    />
  );
};

export const categoryMoreColumn = {
  id: 'more',
  cell: CategoryMoreColumnCell,
  size: 33,
};
