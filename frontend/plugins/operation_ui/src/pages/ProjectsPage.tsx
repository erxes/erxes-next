import { ProjectsRecordTable } from '@/project/components/ProjectsRecordTable';
import { PageHeader } from 'ui-modules';
import { Breadcrumb, Button } from 'erxes-ui';
import { Link } from 'react-router-dom';
import { IconBox } from '@tabler/icons-react';

import { ProjectPageTypes } from '@/project/types';

export const ProjectsPage = ({ type }: { type: ProjectPageTypes }) => {
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

      <ProjectsRecordTable type={type} />
    </>
  );
};
