import { PageHeader } from 'ui-modules';
import {
  Breadcrumb,
  Button,
  IconComponent,
  Separator,
  Skeleton,
} from 'erxes-ui';
import { Link } from 'react-router-dom';
import { IconBox } from '@tabler/icons-react';
import { AddProjectSheet } from '@/project/components/add-project/AddProjectSheet';
import { useParams } from 'react-router-dom';
import { useGetTeams } from '@/team/hooks/useGetTeams';
import { useAtomValue } from 'jotai';
import { currentUserState } from 'ui-modules';

export const ProjectsListBreadCrumb = () => {
  const { teamId } = useParams();

  const currentUser = useAtomValue(currentUserState);

  const { teams, loading } = useGetTeams({
    variables: { userId: currentUser?._id },
  });

  const team = teams?.find((team) => team._id === teamId);

  return (
    <PageHeader>
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
                    <IconBox />
                    Projects
                  </Link>
                </Button>
              </Breadcrumb.Item>
            </>
          ) : (
            <Breadcrumb.Item>
              <Button variant="ghost" asChild>
                <Link to="/operation/projects">
                  <IconBox />
                  Projects
                </Link>
              </Button>
            </Breadcrumb.Item>
          )}
        </Breadcrumb.List>
      </Breadcrumb>
      <AddProjectSheet />
    </PageHeader>
  );
};
