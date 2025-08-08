import { Outlet } from 'react-router-dom';
import { TaskBreadCrumb } from '@/task/components/TaskBreadCrumb';

export const TasksLayout = () => {
  return (
    <div>
      <TaskBreadCrumb />
      <Outlet />
    </div>
  );
};
