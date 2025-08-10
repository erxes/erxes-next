import { PageHeader } from 'ui-modules';
import {
  Breadcrumb,
  Button,
  IconComponent,
  Separator,
  Skeleton,
} from 'erxes-ui';
import { Link } from 'react-router-dom';
import { IconClipboard } from '@tabler/icons-react';
import { AddProjectSheet } from '@/project/components/add-project/AddProjectSheet';
import { useParams } from 'react-router-dom';
import { useGetCurrentUsersTeams } from '@/team/hooks/useGetCurrentUsersTeams';

export const ProjectsListBreadCrumb = () => {
  const { teamId } = useParams();

  const { teams, loading } = useGetCurrentUsersTeams();

  const team = teams?.find((team) => team._id === teamId);

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
                      <Link to={`/operation/team/${teamId}`}>
                        <IconComponent name={team?.icon} />
                        {team?.name}
                      </Link>
                    </Button>
                  </Breadcrumb.Item>
                )}
                <Separator.Inline />
                <Breadcrumb.Item>
                  <Button variant="ghost" asChild>
                    <Link to={`/operation/team/${teamId}/projects`}>
                      <IconClipboard />
                      Projects
                    </Link>
                  </Button>
                </Breadcrumb.Item>
              </>
            ) : (
              <Breadcrumb.Item>
                <Button variant="ghost" asChild>
                  <Link to="/operation/projects">
                    <IconClipboard />
                    Projects
                  </Link>
                </Button>
              </Breadcrumb.Item>
            )}
          </Breadcrumb.List>
        </Breadcrumb>
      </PageHeader.Start>
      <PageHeader.End>
        <AddProjectSheet />
      </PageHeader.End>
    </PageHeader>
  );
};
