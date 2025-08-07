import { ProjectsRecordTable } from '@/project/components/ProjectsRecordTable';
import { PageHeader } from 'ui-modules';
import { Breadcrumb, Button, PageSubHeader } from 'erxes-ui';
import { Link } from 'react-router-dom';
import { IconBox } from '@tabler/icons-react';
import { ProjectsFilter } from '@/project/components/ProjectsFilter';

export const ProjectsPage = () => {
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
          </Breadcrumb.List>
        </Breadcrumb>
      </PageHeader>
      <PageSubHeader>
        <ProjectsFilter />
      </PageSubHeader>
      <ProjectsRecordTable type="all" />
    </>
  );
};
