import { IActivity } from '@/activity/types';

export const ActivityStatus = ({
  metadata,
  action,
}: {
  metadata: IActivity['metadata'];
  action: IActivity['action'];
}) => {
  return <div>ActivityStatus</div>;
};
