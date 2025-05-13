import { IconBook, IconPlus } from '@tabler/icons-react';
import { Breadcrumb, Button, Kbd, Separator } from 'erxes-ui';
import { Link } from 'react-router';
import { PageHeader } from 'ui-modules';

export const CoursesHeader = () => {
  return (
    <PageHeader>
      <PageHeader.Start>
        <Breadcrumb>
          <Breadcrumb.List className="gap-1">
            <Breadcrumb.Item>
              <Button variant="ghost" asChild>
                <Link to="/courses">
                  <IconBook />
                  Хөтөлбөрүүд
                </Link>
              </Button>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>
        <Separator.Inline />
      </PageHeader.Start>
      <PageHeader.End>
        <Link to="/courses/add-course">
          <Button>
            <IconPlus />
            Add course
            <Kbd>C</Kbd>
          </Button>
        </Link>
      </PageHeader.End>
    </PageHeader>
  );
};
