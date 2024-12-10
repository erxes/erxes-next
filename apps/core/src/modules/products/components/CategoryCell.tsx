import { CellContext } from '@tanstack/react-table';
import { ProductT } from '@/products/types/productTypes';
import { useProductCategoies } from '../hooks/useProductCategories';
import { Avatar, Button, Skeleton } from 'erxes-ui/components';

export const CategoryCell = (info: CellContext<ProductT, any>) => {
  const { productCategories, loading } = useProductCategoies();

  if (loading) return <Skeleton className="h-3 w-full" />;

  const category = productCategories?.find(
    (category) => category._id === info.getValue()
  );

  return (
    <Button variant="secondary" size="sm">
      <Avatar.Root>
        <Avatar.Image src={category?.attachment?.url} />
        <Avatar.Fallback colorSeed={category?._id}>
          {category?.name?.charAt(0)}
        </Avatar.Fallback>
      </Avatar.Root>
      {category?.name}
    </Button>
  );
};

export const CategoryCellWrapper = ({ children }: React.PropsWithChildren) => {
  return <div className="flex items-center gap-1 px-2">{children}</div>;
};
