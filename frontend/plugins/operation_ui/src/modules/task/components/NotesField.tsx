import { NoteInputReadOnly } from '@/task/components/NodeInputReadOnly';
import { NoteInput } from '@/task/components/NodeInput';
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
              newValueId={activity.metadata?.newValue}
              authorId={activity.createdBy}
              createdAt={activity.createdAt?.toLocaleString()}
            />
          ))}
      <NoteInput taskId={taskId} />
    </div>
  );
};
