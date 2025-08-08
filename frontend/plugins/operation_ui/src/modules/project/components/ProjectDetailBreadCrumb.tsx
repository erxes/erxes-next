import { Breadcrumb, Button, IconComponent, Separator } from 'erxes-ui';
import { Link, useParams } from 'react-router-dom';
import { useGetProject } from '@/project/hooks/useGetProject';
import { PageHeader } from 'ui-modules';
import { IconBox } from '@tabler/icons-react';
import { AddProjectSheet } from '@/project/components/add-project/AddProjectSheet';

export const ProjectDetailBreadCrumb = () => {
  const { teamId, projectId } = useParams<{
    teamId?: string;
    projectId: string;
  }>();
  const { project } = useGetProject({ projectId: projectId || '' });

  if (!projectId || !project) return null;

  // Determine base path
  const basePath = teamId
    ? `/operation/team/${teamId}/projects/${projectId}`
    : `/operation/projects/${projectId}`;

  return (
    <PageHeader>
      <Breadcrumb>
        <Breadcrumb.List className="gap-1">
          {teamId ? (
            <>
              <Breadcrumb.Item>
                <Button variant="ghost" asChild>
                  <Link to={`/operation/team/${teamId}`}>
                    <IconComponent name={project?.icon} />
                    {project?.name}
                  </Link>
                </Button>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Button variant="ghost" asChild>
                  <Link to={`/operation/team/${teamId}/projects`}>
                    <IconBox />
                    Projects
                  </Link>
                </Button>
              </Breadcrumb.Item>
            </>
          ) : (
            <Breadcrumb.Item>
              <Button variant="ghost" asChild>
                <Link to={`/operation/projects`}>
                  <IconBox />
                  Projects
                </Link>
              </Button>
            </Breadcrumb.Item>
          )}
          <Separator.Inline />
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
            <Button variant="ghost" asChild>
              <Link to={`${basePath}/overview`}>Overview</Link>
            </Button>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Button variant="ghost" asChild>
              <Link to={`${basePath}/tasks`}>Tasks</Link>
            </Button>
          </Breadcrumb.Item>
        </Breadcrumb.List>
        <AddProjectSheet />
      </Breadcrumb>
    </PageHeader>
  );
};
