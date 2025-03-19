import { cn } from 'erxes-ui';

type Props = {
  className?: string;
};
export const SettingsSkeletonLoader = ({ className }: Props) => {
  return (
    <div>
      <div className={cn('animate-pulse bg-gray-200 rounded-sm', className)} />
    </div>
  );
};
