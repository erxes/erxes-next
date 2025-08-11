import { useGetProject } from '@/project/hooks/useGetProject';
import { ProgressChart } from '@/project/components/details/charts/ProgressChart';

export const ProjectDetails = ({ projectId }: { projectId: string }) => {
  const { project } = useGetProject({
    variables: { _id: projectId },
    skip: !projectId,
  });

  if (!project) {
    return null;
  }

  return (
    <div>
      {project?.name}
      <ProgressChart projectId={projectId} project={project} />
    </div>
  );
};
