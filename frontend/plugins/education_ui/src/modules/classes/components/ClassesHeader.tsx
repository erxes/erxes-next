import { IconSchool } from '@tabler/icons-react';
import { Breadcrumb, Button, Separator } from 'erxes-ui';
import { Link } from 'react-router';
import { ClassAddSheet } from '@/classes/add-class/components/ClassAddSheet';
import { PageHeader } from 'ui-modules';

export const ClassesHeader = () => {
  return (
    <PageHeader>
      <PageHeader.Start>
        <Breadcrumb>
          <Breadcrumb.List className="gap-1">
            <Breadcrumb.Item>
              <Button variant="ghost" asChild>
                <Link to="/classes">
                  <IconSchool />
                  Ангиуд
                </Link>
              </Button>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>
        <Separator.Inline />
      </PageHeader.Start>
      <PageHeader.End>
        <ClassAddSheet />
      </PageHeader.End>
    </PageHeader>
  );
};
