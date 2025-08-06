import { useGetProject } from '@/project/hooks/useGetProject';

export const ProjectDetails = ({ projectId }: { projectId: string }) => {
  const { project, loading } = useGetProject({ projectId });

  return <div>{project?.name}</div>;
};
