import { useGetProject } from '@/project/hooks/useGetProject';
import { ProgressChart } from '@/project/components/details/charts/ProgressChart';

export const ProjectDetails = ({ projectId }: { projectId: string }) => {
  const { project } = useGetProject({ variables: { _id: projectId } });

  return (
    <div>
      {project?.name}
      <ProgressChart projectId={projectId} />
    </div>
  );
};
