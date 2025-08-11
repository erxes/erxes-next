import { Outlet } from 'react-router-dom';
import { ProjectDetailBreadCrumb } from '@/project/components/breadcumb/ProjectDetailBreadCrumb';
import { PageHeader } from 'ui-modules';
import { Breadcrumb, Separator } from 'erxes-ui';
import { useParams } from 'react-router-dom';

import { AddProjectSheet } from '@/project/components/add-project/AddProjectSheet';
import { ProjectBreadCrumb } from '@/project/components/breadcumb/ProjectBreadCrumb';
import { TeamBreadCrumb } from '@/team/components/breadcrumb/TeamBreadCrumb';

export const ProjectLayout = () => {
  const { teamId } = useParams<{
    teamId?: string;
  }>();

  return (
    <div>
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
              <Separator.Inline />

              <ProjectDetailBreadCrumb />
            </Breadcrumb.List>
          </Breadcrumb>
        </PageHeader.Start>
        <PageHeader.End>
          <AddProjectSheet />
        </PageHeader.End>
      </PageHeader>
      <Outlet />
    </div>
  );
};
