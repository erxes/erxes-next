import { PageHeader } from 'ui-modules';
import { Breadcrumb, Button, Separator } from 'erxes-ui';
import { Link, useParams } from 'react-router-dom';
import { IconBox } from '@tabler/icons-react';
import { ProjectDetails } from '@/project/components/ProjectDetails';
import { ProjectBreadCrumb } from '@/project/components/ProjectBreadCrumb';

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
                  Projects
                </Link>
              </Button>
            </Breadcrumb.Item>
            <Separator.Inline />
            <ProjectBreadCrumb projectId={projectId} />
          </Breadcrumb.List>
        </Breadcrumb>
      </PageHeader>
      <ProjectDetails projectId={projectId} />
    </>
  );
};
