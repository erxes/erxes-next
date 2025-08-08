import { Outlet } from 'react-router-dom';
import { ProjectsListBreadCrumb } from '@/project/components/ProjectsListBreadCrumb';

export const ProjectLayout = () => {
  return (
    <div>
      <ProjectsListBreadCrumb />
      <Outlet />
    </div>
  );
};
