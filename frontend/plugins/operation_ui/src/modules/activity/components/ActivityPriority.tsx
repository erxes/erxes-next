import { IActivity } from '@/activity/types';
import { PROJECT_PRIORITIES_OPTIONS } from '@/project/constants';
import { PriorityBadge } from '@/task/components/PriorityInline';

export const ActivityPriority = ({
  metadata,
}: {
  metadata: IActivity['metadata'];
}) => {
  const newPriority = PROJECT_PRIORITIES_OPTIONS.find(
    (priority) => priority.value.toString() === metadata?.newValue,
  );

  const oldPriority = PROJECT_PRIORITIES_OPTIONS.find(
    (priority) => priority.value.toString() === metadata?.previousValue,
  );

  return (
    <div className="flex items-center gap-1">
      changed
      <PriorityBadge priority={oldPriority?.value} />
      to
      <PriorityBadge priority={newPriority?.value} />
    </div>
  );
};
