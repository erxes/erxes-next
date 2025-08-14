import { useActivities } from '@/activity/hooks/useActivities';
import { ActivityItem } from '@/activity/components/ActivityItem';
import { ActivityAction } from '@/activity/components/ActivityAction';
import { MembersInline } from 'ui-modules';

export const ActivityList = ({ contentId }: { contentId: string }) => {
  const { activities, loading } = useActivities(contentId);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {activities?.map((activity) => {
        return (
          <div key={activity._id}>
            <div className="flex items-center gap-2">
              <MembersInline.Provider
                memberIds={activity.createdBy ? [activity.createdBy] : []}
              >
                <MembersInline.Avatar size="xl" />
                <MembersInline.Title />
              </MembersInline.Provider>
              <ActivityAction action={activity.action} />
              <ActivityItem activity={activity} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
