import { ProjectsRecordTable } from '@/project/components/ProjectsRecordTable';

export const ProjectsPage = () => {
  return (
    <div className="h-screen">
      <ProjectsRecordTable type="all" />
    </div>
  );
};
