import { useGetProjectProgressByTeam } from '@/project/hooks/useGetProjectProgressByTeam';

export const ProgressByTeam = ({ projectId }: { projectId: string }) => {
  const { projectProgressByTeam } = useGetProjectProgressByTeam({
    variables: { _id: projectId },
    skip: !projectId,
  });

  if (!projectProgressByTeam) {
    return null;
  }

  console.log(projectProgressByTeam);

  return (
    <div>
      {projectProgressByTeam?.map((item) => (
        <div key={item.teamId}>
          <span>{item.teamId} team </span>
          <span>{item.totalScope} total scope </span>
          <span>{item.totalStartedScope} started scope </span>
          <span>{item.totalCompletedScope} completed scope </span>
        </div>
      ))}
    </div>
  );
};
