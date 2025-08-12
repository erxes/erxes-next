import { TaskFields } from '@/task/components/detail/TaskFields';

export const TaskDetails = ({ taskId }: { taskId: string }) => {
  return (
    <div className="h-full w-full flex overflow-hidden">
      <div className="h-full flex flex-auto justify-center mt-12 px-6">
        <div className="w-full xl:max-w-3xl">
          <TaskFields taskId={taskId} />
        </div>
      </div>
    </div>
  );
};
