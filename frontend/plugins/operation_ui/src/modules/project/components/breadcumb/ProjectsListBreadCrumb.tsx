import { PageHeader } from 'ui-modules';
import { Breadcrumb, Separator } from 'erxes-ui';
import { AddProjectSheet } from '@/project/components/add-project/AddProjectSheet';
import { useParams } from 'react-router-dom';
import { ProjectBreadCrumb } from './ProjectBreadCrumb';
import { TeamBreadCrumb } from '~/modules/team/components/breadcrumb/TeamBreadCrumb';

export const ProjectsListBreadCrumb = () => {
  const { teamId } = useParams();

  return (
    <PageHeader>
      <PageHeader.Start>
        <Breadcrumb>
          <Breadcrumb.List className="gap-1">
            {teamId ? (
              <>
                <TeamBreadCrumb />
                <Separator.Inline />
                <ProjectBreadCrumb
                  link={`/operation/team/${teamId}/projects`}
                />
              </>
            ) : (
              <ProjectBreadCrumb link={`/operation/projects`} />
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
