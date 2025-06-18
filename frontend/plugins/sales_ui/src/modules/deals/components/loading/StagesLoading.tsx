import { Skeleton } from 'erxes-ui';

export const StagesLoading = () => {
  return (
    <div className="flex w-full gap-3">
      <Skeleton className="w-72 h-full rounded-md" />
      <Skeleton className="w-72 h-full rounded-md" />
      <Skeleton className="w-72 h-full rounded-md" />
      <Skeleton className="w-72 h-full rounded-md" />
      <Skeleton className="w-72 h-full rounded-md" />
    </div>
  );
};
