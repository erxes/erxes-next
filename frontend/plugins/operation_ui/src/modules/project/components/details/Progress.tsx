import { useGetProjectProgress } from '~/modules/project/hooks/useGetProjectProgress';

export const Progress = ({ projectId }: { projectId: string }) => {
  const { getProjectProgress } = useGetProjectProgress({
    variables: { _id: projectId },
    skip: !projectId,
  });

  console.log(getProjectProgress);

  return <div>Prograess</div>;
};
