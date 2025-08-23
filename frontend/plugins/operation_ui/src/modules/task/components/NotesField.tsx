import { NoteInputReadOnly } from '@/task/components/NoteInputReadOnly';
import { NoteInput } from '@/task/components/NoteInput';
import { useActivities } from '@/activity/hooks/useActivities';

export const NotesField = ({ taskId }: { taskId: string }) => {
  const { activities } = useActivities(taskId);
  return (
    <div className="flex flex-col gap-4 mb-14">
      {activities &&
        activities
          ?.filter((activity) => activity.module === 'NOTE')
          .map((activity) => (
            <NoteInputReadOnly
              key={activity._id}
              newValueId={activity.metadata?.newValue}
              authorId={activity.createdBy}
              createdAt={activity.createdAt?.toLocaleString()}
            />
          ))}
      <NoteInput taskId={taskId} />
    </div>
  );
};
