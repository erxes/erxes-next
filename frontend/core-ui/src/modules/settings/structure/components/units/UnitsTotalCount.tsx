import { Skeleton } from 'erxes-ui';
import { useUnitsList } from '../../hooks/useUnitsList';

export function UnitsTotalCount() {
  const { totalCount, loading } = useUnitsList();

  return (
    <span className="text-sm text-muted-foreground">
      {loading ? <Skeleton className="size-4" /> : `(${totalCount})`}
    </span>
  );
}
