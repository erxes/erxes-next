import { PageSubHeader, Skeleton } from 'erxes-ui';

type Props = {
  totalCount: number;
  loading: boolean;
};

export const AutomationRecordTableFilters = ({
  totalCount,
  loading,
}: Props) => {
  return (
    <PageSubHeader>
      <div className="text-muted-foreground font-medium text-sm whitespace-nowrap h-7 leading-7">
        {totalCount
          ? `${totalCount} records found`
          : loading && <Skeleton className="w-20 h-4 inline-block mt-1.5" />}
      </div>
    </PageSubHeader>
  );
};
