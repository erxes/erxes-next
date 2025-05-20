import { Skeleton } from 'erxes-ui';
import { usePositionsList } from '../../hooks/usePositionsList';

export function PositionsTotalCount() {
  const { totalCount, loading } = usePositionsList();

  return (
    <span className="text-sm text-muted-foreground">
      {loading ? <Skeleton className="size-4" /> : `(${totalCount})`}
    </span>
  );
}
