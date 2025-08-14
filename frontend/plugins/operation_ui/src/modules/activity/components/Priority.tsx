import { IActivity } from '@/activity/types';
import { PROJECT_PRIORITIES_OPTIONS } from '@/project/constants';

export const Priority = ({ metadata }: { metadata: IActivity['metadata'] }) => {
  const newPriority = PROJECT_PRIORITIES_OPTIONS.find(
    (priority) => priority.value.toString() === metadata?.newValue,
  );

  const oldPriority = PROJECT_PRIORITIES_OPTIONS.find(
    (priority) => priority.value.toString() === metadata?.previousValue,
  );

  return (
    <div>
      {oldPriority?.name} to {newPriority?.name}
    </div>
  );
};
