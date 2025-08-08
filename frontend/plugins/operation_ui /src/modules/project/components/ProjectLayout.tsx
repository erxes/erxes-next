import { Outlet } from 'react-router-dom';
import { ProjectBreadCrumb } from '@/project/components/ProjectBreadCrumb';

export const ProjectLayout = () => {
  return (
    <div>
      <ProjectBreadCrumb />
      <Outlet />
    </div>
  );
};
