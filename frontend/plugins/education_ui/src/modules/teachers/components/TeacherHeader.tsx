import { IconSchool } from '@tabler/icons-react';
import { Breadcrumb, Button, Separator } from 'erxes-ui';
import { Link } from 'react-router';
import { PageHeader } from 'ui-modules';
import { TeacherAddDialog } from '@/teachers/add-teacher/components/TeacherAddDialog';

export const TeacherHeader = () => {
  return (
    <PageHeader>
      <PageHeader.Start>
        <Breadcrumb>
          <Breadcrumb.List className="gap-1">
            <Breadcrumb.Item>
              <Button variant="ghost" asChild>
                <Link to="/teachers">
                  <IconSchool />
                  Багш
                </Link>
              </Button>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>
        <Separator.Inline />
      </PageHeader.Start>
      <PageHeader.End>
        <TeacherAddDialog />
      </PageHeader.End>
    </PageHeader>
  );
};
