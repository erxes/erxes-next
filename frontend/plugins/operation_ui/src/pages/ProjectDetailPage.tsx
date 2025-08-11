import { ProjectDetails } from '@/project/components/details/ProjectDetails';
import { useParams } from 'react-router-dom';

export const ProjectDetailPage = () => {
  const { projectId } = useParams();

  if (!projectId) return null;

  return <ProjectDetails projectId={projectId} />;
};
