import { Outlet } from 'react-router-dom';
import { ProjectDetailBreadCrumb } from '@/project/components/ProjectDetailBreadCrumb';

export const ProjectLayout = () => {
  return (
    <div>
      <ProjectDetailBreadCrumb />
      <Outlet />
    </div>
  );
};
