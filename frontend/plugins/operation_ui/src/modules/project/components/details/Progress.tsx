import { useGetProjectProgress } from '~/modules/project/hooks/useGetProjectProgress';

export const Progress = ({ projectId }: { projectId: string }) => {
  const { projcetProgress } = useGetProjectProgress({
    variables: { _id: projectId },
    skip: !projectId,
  });

  return (
    <div>
      <span>total: {projcetProgress?.totalScope || 0}</span>
      <span>started: {projcetProgress?.totalStartedScope || 0}</span>
      <span>completed: {projcetProgress?.totalCompletedScope || 0}</span>
    </div>
  );
};
