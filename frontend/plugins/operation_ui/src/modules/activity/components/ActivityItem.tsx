import { ACTIVITY_MODULES } from '@/activity/constants';
import { IActivity } from '@/activity/types';
import { ActivityPriority } from '@/activity/components/ActivityPriority';
import { Name } from '@/activity/components/Name';
import {
  IconAlertSquareRounded,
  IconCalendar,
  IconLabel,
  IconProgressCheck,
  IconUsersGroup,
} from '@tabler/icons-react';
import { MembersInline } from 'ui-modules';

export const ActivityItem = ({ activity }: { activity: IActivity }) => {
  const { metadata, action } = activity;

  switch (activity.module) {
    case ACTIVITY_MODULES.NAME:
      return <Name metadata={metadata} />;
    case ACTIVITY_MODULES.STATUS:
      return <div>STATUS</div>;
    case ACTIVITY_MODULES.LEAD:
      return <div>LEAD</div>;
    case ACTIVITY_MODULES.PRIORITY:
      return <ActivityPriority metadata={metadata} />;
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

export const ActivityIcon = ({ activity }: { activity: IActivity }) => {
  switch (activity.module) {
    case ACTIVITY_MODULES.NAME:
      return <IconLabel className="size-4 text-accent-foreground" />;
    case ACTIVITY_MODULES.STATUS:
      return <IconProgressCheck className="size-4 text-accent-foreground" />;

    case ACTIVITY_MODULES.PRIORITY:
      return (
        <IconAlertSquareRounded
          className="size-4 
      text-accent-foreground"
        />
      );
    case ACTIVITY_MODULES.TEAM:
      return <IconUsersGroup className="size-4 text-accent-foreground" />;
    case ACTIVITY_MODULES.START_DATE:
      return <IconCalendar className="size-4 text-accent-foreground" />;
    case ACTIVITY_MODULES.END_DATE:
      return <IconCalendar className="size-4 text-accent-foreground" />;
    case ACTIVITY_MODULES.ASSIGNEE:
      return (
        <MembersInline.Provider
          memberIds={activity.createdBy ? [activity.createdBy] : []}
        >
          <MembersInline.Avatar />
        </MembersInline.Provider>
      );
  }
};
