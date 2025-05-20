import { Skeleton } from 'erxes-ui';
import { useDepartmentsList } from '../../hooks/useDepartmentsList';

export function DepartmentsTotalCount() {
  const { totalCount, loading } = useDepartmentsList();

  return (
    <span className="text-sm text-muted-foreground">
      {loading ? <Skeleton className="size-4" /> : `(${totalCount})`}
    </span>
  );
}
