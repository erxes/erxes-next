import { Breadcrumb, Button } from 'erxes-ui';
import { Link, useParams } from 'react-router-dom';

import { PageHeader } from 'ui-modules';
import { IconBox } from '@tabler/icons-react';
import { AddTasksheet } from '@/task/components/add-task/AddTaskSheet';
import { useGetCurrentUsersTeams } from '@/team/hooks/useGetCurrentUsersTeams';
import { IconComponent } from 'erxes-ui';
import { Separator } from 'erxes-ui';
import { Skeleton } from 'erxes-ui';

export const TasksListBreadCrumb = () => {
  const { teamId } = useParams();

  const { teams, loading } = useGetCurrentUsersTeams();

  const team = teams?.find((team) => team._id === teamId);

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
                {loading ? (
                  <Skeleton className="w-12 h-[1lh]" />
                ) : (
                  <Breadcrumb.Item>
                    <Button variant="ghost" asChild>
                      <Link to={`/operation/team/${teamId}/tasks`}>
                        <IconComponent name={team?.icon} />
                        {team?.name}
                      </Link>
                    </Button>
                  </Breadcrumb.Item>
                )}
                <Separator.Inline />
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
      <AddTasksheet />
    </PageHeader>
  );
};
