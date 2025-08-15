import { Outlet } from 'react-router-dom';

import { PageContainer } from 'erxes-ui';

export const TasksLayout = () => {
  return (
    <PageContainer>
      <Outlet />
    </PageContainer>
  );
};
