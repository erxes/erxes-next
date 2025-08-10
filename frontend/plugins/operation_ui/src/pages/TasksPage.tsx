import { TasksListBreadCrumb } from '@/task/components/TasksListBreadCrumb';
import { TasksRecordTable } from '@/task/components/TasksRecordTable';

export const TasksPage = () => {
  return (
    <>
      <TasksListBreadCrumb />
      <TasksRecordTable />
    </>
  );
};
