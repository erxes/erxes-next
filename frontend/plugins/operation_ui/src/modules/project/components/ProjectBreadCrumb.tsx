import { Breadcrumb, Button, IconComponent } from 'erxes-ui';
import { Link } from 'react-router-dom';
import { useGetProject } from '@/project/hooks/useGetProject';

export const ProjectBreadCrumb = ({ projectId }: { projectId: string }) => {
  const { project } = useGetProject({ projectId });

  return (
    <Breadcrumb.Item>
      <Button variant="ghost" asChild>
        <Link to={`/operation/projects/${projectId}`}>
          <IconComponent name={project?.icon} />
          {project?.name}
        </Link>
      </Button>
    </Breadcrumb.Item>
  );
};
