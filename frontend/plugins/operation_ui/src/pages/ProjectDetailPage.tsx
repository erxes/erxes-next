import { PageHeader } from 'ui-modules';
import { Breadcrumb, Button, Separator } from 'erxes-ui';
import { Link, useParams } from 'react-router-dom';
import { IconBox, IconSandbox } from '@tabler/icons-react';
import { ProjectDetails } from '@/project/components/ProjectDetails';

export const ProjectDetailPage = () => {
  const { projectId } = useParams();

  if (!projectId) return null;

  return (
    <>
      <PageHeader>
        <Breadcrumb>
          <Breadcrumb.List className="gap-1">
            <Breadcrumb.Item>
              <Button variant="ghost" asChild>
                <Link to="/operation/projects">
                  <IconBox />
                  All projects
                </Link>
              </Button>
            </Breadcrumb.Item>
            <Separator.Inline />
            <Breadcrumb.Item>
              <Button variant="ghost" asChild>
                <Link to={`/operation/projects/${projectId}`}>
                  <IconSandbox />
                  Project detail
                </Link>
              </Button>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>
      </PageHeader>
      <ProjectDetails projectId={projectId} />
    </>
  );
};
