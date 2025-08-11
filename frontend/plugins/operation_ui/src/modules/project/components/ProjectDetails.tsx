import { useGetProject } from '@/project/hooks/useGetProject';

export const ProjectDetails = ({ projectId }: { projectId: string }) => {
  const { project } = useGetProject({ variables: { _id: projectId } });

  return <div>{project?.name}</div>;
};
