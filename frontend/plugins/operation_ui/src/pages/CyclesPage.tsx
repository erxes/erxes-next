import { Breadcrumb } from 'erxes-ui';
import { useParams } from 'react-router-dom';
import { PageHeader } from 'ui-modules';
import { AddTaskSheet } from '@/task/components/add-task/AddTaskSheet';
import { Separator } from 'erxes-ui';
import { CyclesRecordTable } from '@/cycle/components/CyclesRecordTable';

export const CyclesPage = () => {
  //   const { teamId } = useParams();

  //   // Determine base path
  //   const basePath = teamId
  //     ? `/operation/team/${teamId}/tasks`
  //     : `/operation/tasks`;
  return (
    <>
      <PageHeader>
        {/* <PageHeader.Start>
          <Breadcrumb>
            <Breadcrumb.List className="gap-1">
              {teamId && (
                <>
                  <TeamBreadCrumb />
                  <Separator.Inline />
                </>
              )}
              <TaskBreadCrump link={basePath} />
            </Breadcrumb.List>
          </Breadcrumb>
        </PageHeader.Start> */}
        <AddTaskSheet />
      </PageHeader>
      <CyclesRecordTable />
    </>
  );
};
