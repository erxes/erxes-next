import { ACTIVITY_ACTIONS } from '@/activity/constants';
import { IActivity } from '@/activity/types';

export const ActivityAction = ({ action }: { action: IActivity['action'] }) => {
  switch (action) {
    case ACTIVITY_ACTIONS.CREATED:
      return <div>Created</div>;
    case ACTIVITY_ACTIONS.CHANGED:
      return <div>Changed</div>;
    case ACTIVITY_ACTIONS.REMOVED:
      return <div>Removed</div>;
    default:
      return <div>Unknown action</div>;
  }
};
