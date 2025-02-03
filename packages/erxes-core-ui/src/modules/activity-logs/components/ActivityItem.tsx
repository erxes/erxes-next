import { IconEdit } from '@tabler/icons-react';
import { IActivityLog } from '@/activity-logs/types/activityTypes';
import { RelativeDateDisplay } from 'erxes-ui/display';
import { ActivityTagged } from './ActivityTagged';
import {
  ActivityItemContext,
  useActivityItemContext,
} from '@/activity-logs/context/ActivityItemContext';
import { cn } from 'erxes-ui/lib';

export const ActivityItem = ({
  activity,
  contentTypeModule,
  isLast,
}: {
  activity: IActivityLog;
  isLast: boolean;
  contentTypeModule: string | null;
}) => {
  return (
    <div className="flex gap-2">
      <ActivityItemContext.Provider
        value={{ ...activity, isLast, contentTypeModule }}
      >
        <ActivityItemIcon />
        <div className="flex-1 pb-5 text-sm">
          <div className="text-sm min-h-10 line-clamp-2 inline-flex items-center gap-1">
            <span className="font-bold whitespace-nowrap">
              <ActivityCreator />
            </span>
            {activity.action}
          </div>
          <div className="bg-muted p-3 rounded-lg space-y-2">
            <ActivityItemDate />
            <div className="text-sm">
              <ActivityItemContent />
            </div>
          </div>
        </div>
      </ActivityItemContext.Provider>
    </div>
  );
};

export const ActivityCreator = () => {
  const { createdByDetail } = useActivityItemContext();
  return <>{createdByDetail.content.details.fullName}</>;
};

const ActivityItemContent = () => {
  const { contentType, action } = useActivityItemContext();
  const pluginName = contentType.split(':')[0];

  if (pluginName === 'core') {
    switch (action) {
      case 'tagged':
        return <ActivityTagged />;

      default:
        return <>Gal Zorigo assigned the tag “erxes” to this contact.</>;
    }
  }
};

const ActivityItemDate = () => {
  const { createdAt } = useActivityItemContext();
  return (
    <div className="text-muted-foreground">
      <RelativeDateDisplay value={createdAt} />
    </div>
  );
};

const ActivityItemIcon = () => {
  const { action, isLast } = useActivityItemContext();
  return (
    <div className="relative">
      <div
        className={cn(
          'absolute left-5 h-full top-0 left-1/2 -translate-x-1/2 border-l border-input',
          isLast ? 'hidden' : '',
        )}
      />
      <div className="w-10 h-10 border rounded-full flex items-center justify-center bg-background relative">
        <IconEdit className="size-5 text-primary" />
      </div>
    </div>
  );
};
