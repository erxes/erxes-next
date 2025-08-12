import { useGetProjectProgressByMember } from '@/project/hooks/useGetProjectProgressByMember';

export const ProgressByMember = ({ projectId }: { projectId: string }) => {
  const { projectProgressByMember } = useGetProjectProgressByMember({
    variables: { _id: projectId },
    skip: !projectId,
  });

  console.log(projectProgressByMember);

  return (
    <div>
      {projectProgressByMember?.map((item) => (
        <div key={item.assigneeId}>
          <span>{item.assigneeId} assignee </span>
          <span>{item.totalScope} total scope </span>
          <span>{item.totalStartedScope} started scope </span>
          <span>{item.totalCompletedScope} completed scope </span>
        </div>
      ))}
    </div>
  );
};
