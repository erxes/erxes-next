import { Breadcrumb, Button } from 'erxes-ui';
import { Link, useParams } from 'react-router-dom';
import { PageHeader } from 'ui-modules';
import { Separator } from 'erxes-ui';
import { CyclesRecordTable } from '@/cycle/components/CyclesRecordTable';
import { AddCycleSheet } from '@/cycle/components/add-cycle/AddCycle';
import { TeamBreadCrumb } from '@/team/components/breadcrumb/TeamBreadCrumb';
import { IconCalendarRepeat } from '@tabler/icons-react';

export const CyclesPage = () => {
  const { teamId } = useParams();
  const link = `/operation/team/${teamId}/cycles`;
  return (
    <>
      <PageHeader>
        <PageHeader.Start>
          <Breadcrumb>
            <Breadcrumb.List className="gap-1">
              <TeamBreadCrumb />
              <Separator.Inline />
              <Breadcrumb.Item>
                <Button variant="ghost" asChild>
                  <Link to={link}>
                    <IconCalendarRepeat />
                    Cycles
                  </Link>
                </Button>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
        </PageHeader.Start>
        <AddCycleSheet />
      </PageHeader>
      <CyclesRecordTable />
    </>
  );
};
