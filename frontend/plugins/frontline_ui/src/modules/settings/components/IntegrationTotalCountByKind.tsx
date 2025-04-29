import { Skeleton } from 'erxes-ui/components/skeleton';
import { useIntegrationsCounts } from '../hooks/useIntegrationsCounts';

export const IntegrationTotalCountByKind = () => {
  const { totalCount, loading } = useIntegrationsCounts();

  return (
    <span className="text-sm text-muted-foreground">
      {loading ? (
        <Skeleton className="size-4" />
      ) : (
        `(${totalCount || 'No results found'})`
      )}
    </span>
  );
};
