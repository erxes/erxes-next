import { PageHeader } from 'ui-modules';
import { Breadcrumb, Separator } from 'erxes-ui';
import { useParams } from 'react-router-dom';
import { TeamBreadCrumb } from '@/team/components/breadcrumb/TeamBreadCrumb';
import { AddTaskSheet } from '@/task/components/add-task/AddTaskSheet';
import { CyclesBreadcrumb } from '@/cycle/components/CyclesBreadcrumb';
import { useGetCycle } from '@/cycle/hooks/useGetCycle';
export const CycleDetailHeader = () => {
  const { teamId, cycleId } = useParams<{
    teamId?: string;
    cycleId: string;
  }>();
  const { cycleDetail } = useGetCycle(cycleId);

  return (
    <PageHeader>
      <PageHeader.Start>
        <Breadcrumb>
          <Breadcrumb.List className="gap-1">
            <TeamBreadCrumb />
            <Separator.Inline />
            <CyclesBreadcrumb link={`/operation/team/${teamId}/cycles`} />
            <Separator.Inline />
            <Breadcrumb.Item className="text-sm font-medium">
              {cycleDetail?.name}
            </Breadcrumb.Item>
            <Separator.Inline />
            <Breadcrumb.Item className="text-sm font-medium">
              Tasks
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>
      </PageHeader.Start>
      <PageHeader.End>
        <AddTaskSheet />
      </PageHeader.End>
    </PageHeader>
  );
};
