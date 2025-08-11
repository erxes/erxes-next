import {
  Breadcrumb,
  Button,
  IconComponent,
  Separator,
  Skeleton,
} from 'erxes-ui';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useGetProject } from '@/project/hooks/useGetProject';

export const ProjectDetailBreadCrumb = () => {
  const { teamId, projectId } = useParams<{
    teamId?: string;
    projectId: string;
  }>();
  const { pathname } = useLocation();

  const { project, loading } = useGetProject({
    variables: { _id: projectId },
    skip: !projectId,
  });

  if (loading) {
    return <Skeleton className="w-12 h-[1lh]" />;
  }

  // Determine base path
  const basePath = teamId
    ? `/operation/team/${teamId}/projects/${projectId}`
    : `/operation/projects/${projectId}`;

  const isActive = (path: string) => {
    return pathname.startsWith(`${basePath}/${path}`);
  };

  return (
    <Breadcrumb>
      <Breadcrumb.List className="gap-1">
        <Breadcrumb.Item>
          <Button variant="ghost" asChild>
            <Link to={`${basePath}/overview`}>
              <IconComponent name={project?.icon} />
              {project?.name}
            </Link>
          </Button>
        </Breadcrumb.Item>
        <Separator.Inline />

        <Breadcrumb.Item>
          <Button
            variant={isActive('overview') ? 'secondary' : 'ghost'}
            asChild
            className={`rounded-lg border`}
          >
            <Link to={`${basePath}/overview`}>Overview</Link>
          </Button>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Button
            variant={isActive('tasks') ? 'secondary' : 'ghost'}
            asChild
            className={`rounded-lg border`}
          >
            <Link to={`${basePath}/tasks`}>Tasks</Link>
          </Button>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb>
  );
};
