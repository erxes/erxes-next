import { Skeleton } from 'erxes-ui';
import { useCustomers } from '../hooks/useCustomers';

export const CustomerTotalCount = () => {
  const { totalCount, loading } = useCustomers();
  return (
    <div className="text-muted-foreground font-medium text-sm">
      {totalCount
        ? `${totalCount} records found`
        : loading && <Skeleton className="w-20 h-4" />}
    </div>
  );
};
