import { useAccounts } from '@/account/hooks/useAccounts';
import { Skeleton } from 'erxes-ui/components/skeleton';

export const AccountsTotalCount = () => {
  const { totalCount, loading } = useAccounts();

  return (
    <span className="text-sm text-muted-foreground">
      {loading ? <Skeleton className="size-4" /> : `(${totalCount})`}
    </span>
  );
};
