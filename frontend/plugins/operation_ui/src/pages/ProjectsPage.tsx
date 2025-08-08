import { ProjectsRecordTable } from '@/project/components/ProjectsRecordTable';
import { ProjectsListBreadCrumb } from '@/project/components/ProjectsListBreadCrumb';

export const ProjectsPage = () => {
  return (
    <>
      <ProjectsListBreadCrumb />

      <ProjectsRecordTable />
    </>
  );
};
