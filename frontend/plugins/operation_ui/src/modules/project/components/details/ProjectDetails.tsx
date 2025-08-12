import { useGetProject } from '@/project/hooks/useGetProject';
import { ProgressChart } from '@/project/components/details/ProgressChart';
import { Progress } from '@/project/components/details/Progress';
import { ProgressByMember } from '@/project/components/details/ProgressByMember';
import { ProgressByTeam } from '@/project/components/details/ProgressByTeam';

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
      <Progress projectId={projectId} />
      <ProgressByMember projectId={projectId} />
      <ProgressByTeam projectId={projectId} />
      <ProgressChart projectId={projectId} />
    </div>
  );
};
