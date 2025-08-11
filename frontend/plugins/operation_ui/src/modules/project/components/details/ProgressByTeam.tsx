import { useGetProjectProgressByTeam } from '@/project/hooks/useGetProjectProgressByTeam';

export const ProgressByTeam = ({ projectId }: { projectId: string }) => {
  const { getProjectProgressByTeam } = useGetProjectProgressByTeam({
    variables: { _id: projectId },
    skip: !projectId,
  });

  if (!getProjectProgressByTeam) {
    return null;
  }

  console.log(getProjectProgressByTeam);

  return <div>ProgressByTeam</div>;
};
