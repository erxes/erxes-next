import { IconSchool } from '@tabler/icons-react';
import { Breadcrumb, Button, Separator } from 'erxes-ui';
import { Link } from 'react-router';
import { PageHeader } from 'ui-modules';

export const StudentHeader = () => {
  return (
    <PageHeader>
      <PageHeader.Start>
        <Breadcrumb>
          <Breadcrumb.List className="gap-1">
            <Breadcrumb.Item>
              <Button variant="ghost" asChild>
                <Link to="/students">
                  <IconSchool />
                  Сурагчид
                </Link>
              </Button>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>
        <Separator.Inline />
      </PageHeader.Start>
    </PageHeader>
  );
};
