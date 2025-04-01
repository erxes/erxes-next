import { Skeleton } from 'erxes-ui';
import { useCountByOptions } from '@/settings/team-member/hooks/useCountByOptions';

export function TeamMemberCounts({
  queryKey,
  _id,
}: {
  queryKey: string;
  _id?: string;
}) {
  const { usersTotalCount, loading } = useCountByOptions({
    variables: { [queryKey]: _id },
  });

  return (
    <span className="text-sm text-muted-foreground">
      {loading ? <Skeleton className="size-4" /> : `(${usersTotalCount})`}
    </span>
  );
}
