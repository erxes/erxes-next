import { Skeleton } from 'erxes-ui';
import { useBranchesList } from '../../hooks/useBranchesList';

export function BranchesTotalCount() {
  const { totalCount, loading } = useBranchesList();

  return (
    <span className="text-sm text-muted-foreground">
      {loading ? <Skeleton className="size-4" /> : `(${totalCount})`}
    </span>
  );
}
