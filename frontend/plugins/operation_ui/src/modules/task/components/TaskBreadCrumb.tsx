import { Breadcrumb, Button } from 'erxes-ui';
import { Link, useParams } from 'react-router-dom';

import { PageHeader } from 'ui-modules';
import { IconBox } from '@tabler/icons-react';

export const TaskBreadCrumb = () => {
  const { teamId } = useParams<{
    teamId?: string;
  }>();

  // Determine base path
  const basePath = teamId
    ? `/operation/team/${teamId}/tasks`
    : `/operation/tasks`;

  return (
    <PageHeader>
      <PageHeader.Start>
        <Breadcrumb>
          <Breadcrumb.List className="gap-1">
            {teamId ? (
              <>
                <Breadcrumb.Item>
                  <Button variant="ghost" asChild>
                    <Link to={`/operation/team/${teamId}`}>Tasks</Link>
                  </Button>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Button variant="ghost" asChild>
                    <Link to={`/operation/team/${teamId}/tasks`}>
                      <IconBox />
                      Tasks
                    </Link>
                  </Button>
                </Breadcrumb.Item>
              </>
            ) : (
              <Breadcrumb.Item>
                <Button variant="ghost" asChild>
                  <Link to={`${basePath}`}>
                    <IconBox />
                    Tasks
                  </Link>
                </Button>
              </Breadcrumb.Item>
            )}
          </Breadcrumb.List>
        </Breadcrumb>
      </PageHeader.Start>
    </PageHeader>
  );
};
