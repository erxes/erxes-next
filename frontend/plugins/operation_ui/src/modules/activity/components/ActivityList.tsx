import { useActivities } from '@/activity/hooks/useActivities';

export const ActivityList = ({ contentId }: { contentId: string }) => {
  const { activities, loading } = useActivities(contentId);

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log(activities);

  return <div>ActivityList</div>;
};
