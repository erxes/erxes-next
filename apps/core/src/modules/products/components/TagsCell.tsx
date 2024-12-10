import type { CellContext } from '@tanstack/react-table';
import { ProductT } from '@/products/types/productTypes';
import { useProductTags } from '@/products/hooks/useProductTags';
import { Badge, Skeleton } from 'erxes-ui/components';

export const TagsCell = (info: CellContext<ProductT, any>) => {
  const { tags, loading } = useProductTags();

  if (loading) return <Skeleton className="h-3 w-full" />;

  return (
    <div className="flex items-center gap-1 px-2">
      {info.getValue()?.map((tagId) => {
        const tagName = tags?.find((t) => t._id === tagId)?.name;

        if (!tagName) return null;

        return (
          <Badge color="crimson" key={tagId}>
            {tags?.find((t) => t._id === tagId)?.name}
          </Badge>
        );
      })}
    </div>
  );
};
