import { Outlet } from 'react-router-dom';
import { TaskBreadCrumb } from '@/task/components/TaskBreadCrumb';
import { PageContainer } from 'erxes-ui';

export const TasksLayout = () => {
  return (
    <PageContainer>
      <TaskBreadCrumb />

      <Outlet />
    </PageContainer>
  );
};
