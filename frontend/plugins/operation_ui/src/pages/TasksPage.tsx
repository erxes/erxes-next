import { TasksRecordTable } from '@/task/components/TasksRecordTable';
import { TaskPageTypes } from '@/project/types';

export const TasksPage = ({ type }: { type: TaskPageTypes }) => {
  return (
    <div className="h-screen">
      <TasksRecordTable type={type} />
    </div>
  );
};
