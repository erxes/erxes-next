import { Outlet } from 'react-router-dom';
import { TasksListBreadCrumb } from '~/modules/task/components/TasksListBreadCrumb';
import { PageContainer } from 'erxes-ui';

export const TasksLayout = () => {
  return (
    <PageContainer>
      <TasksListBreadCrumb />

      <Outlet />
    </PageContainer>
  );
};
