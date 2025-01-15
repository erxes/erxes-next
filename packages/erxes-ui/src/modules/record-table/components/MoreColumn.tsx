import { MoreHorizontalIcon } from 'lucide-react';

export const moreColumn = {
  accessorKey: 'more',
  id: 'more',
  size: 33,
  header: () => null,
  cell: () => {
    return (
      <div className="flex items-center justify-center">
        <MoreHorizontalIcon className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  },
};
