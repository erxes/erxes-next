import { useActivities } from '@/activity/hooks/useActivities';
import { ActivityIcon, ActivityItem } from '@/activity/components/ActivityItem';
import { MembersInline } from 'ui-modules';
import { RelativeDateDisplay } from 'erxes-ui';

export const ActivityList = ({ contentId }: { contentId: string }) => {
  const { activities, loading } = useActivities(contentId);

  if (loading) {
    return;
  }

  return (
    <div className="ml-2.5 space-y-6 relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-muted before:-translate-x-1/2 mb-12">
      {activities?.map((activity) => (
        <div className="flex items-center gap-1">
          <div className="size-5 -ml-2.5 shadow-xs rounded-full bg-background relative flex items-center justify-center">
            <ActivityIcon activity={activity} />
          </div>
          <RelativeDateDisplay
            value={activity.createdAt?.toLocaleString()}
            key={activity._id}
            asChild
          >
            <div className="flex items-center gap-1 text-sm">
              <div className="ml-1">
                <MembersInline.Provider
                  memberIds={activity.createdBy ? [activity.createdBy] : []}
                >
                  <MembersInline.Title />
                </MembersInline.Provider>
              </div>
              {/* 
            <ActivityAction action={activity.action} />
            <ActivityItem activity={activity} /> */}
              <ActivityItem activity={activity} />
              <div className="text-accent-foreground ml-2">
                <RelativeDateDisplay.Value
                  value={activity.createdAt?.toLocaleString()}
                />
              </div>
            </div>
          </RelativeDateDisplay>
        </div>
      ))}
    </div>
  );
};
