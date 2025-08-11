import { useGetProjectProgressByMember } from '@/project/hooks/useGetProjectProgressByMember';

export const ProgressByMember = ({ projectId }: { projectId: string }) => {
  const { getProjectProgressByMember } = useGetProjectProgressByMember({
    variables: { _id: projectId },
    skip: !projectId,
  });

  console.log(getProjectProgressByMember);

  return <div>ProgressBydMembers</div>;
};
