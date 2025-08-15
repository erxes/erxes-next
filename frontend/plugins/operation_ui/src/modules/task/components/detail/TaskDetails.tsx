import { TaskFields } from '@/task/components/detail/TaskFields';
import { useGetTask } from '@/task/hooks/useGetTask';

export const TaskDetails = ({ taskId }: { taskId: string }) => {
  const { task } = useGetTask({
    variables: { _id: taskId },
  });

  if (!task) {
    return null;
  }

  return (
    <div className="h-full w-full flex overflow-hidden">
      <div className="h-full flex flex-auto justify-center mt-12 px-6">
        <div className="w-full xl:max-w-3xl">
          <TaskFields task={task} />
        </div>
      </div>
    </div>
  );
};
