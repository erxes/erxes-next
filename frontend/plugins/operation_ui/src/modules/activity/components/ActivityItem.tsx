import { ACTIVITY_MODULES } from '@/activity/constants';
import { IActivity } from '@/activity/types';
import { Priority } from '@/activity/components/Priority';
import { Name } from '@/activity/components/Name';

export const ActivityItem = ({ activity }: { activity: IActivity }) => {
  const { metadata } = activity;

  switch (activity.module) {
    case ACTIVITY_MODULES.NAME:
      return <Name metadata={metadata} />;
    case ACTIVITY_MODULES.STATUS:
      return <div>STATUS</div>;
    case ACTIVITY_MODULES.LEAD:
      return <div>LEAD</div>;
    case ACTIVITY_MODULES.PRIORITY:
      return <Priority metadata={metadata} />;
    case ACTIVITY_MODULES.TEAM:
      return <div>TEAM</div>;
    case ACTIVITY_MODULES.START_DATE:
      return <div>START_DATE</div>;
    case ACTIVITY_MODULES.END_DATE:
      return <div>END_DATE</div>;
    case ACTIVITY_MODULES.ASSIGNEE:
      return <div>ASSIGNEE</div>;
    default:
      return <div>Unknown module</div>;
  }
};
