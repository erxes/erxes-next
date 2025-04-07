import { Skeleton } from 'erxes-ui';
import { useUsers } from '@/settings/team-member/hooks/useUsers';

export function TeamMemberCounts() {
  const { totalCount, loading } = useUsers();

  return (
    <span className="text-sm text-muted-foreground">
      {loading ? <Skeleton className="size-4" /> : `(${totalCount})`}
    </span>
  );
}
