import { IconBook } from '@tabler/icons-react';
import { Breadcrumb, Button, Separator } from 'erxes-ui';
import { Link } from 'react-router';
import { PageHeader } from 'ui-modules';
import { CourseCategoryAddDialog } from '~/modules/courses/add-category/components/CourseCategoryAddDialog';

export const CourseCategoryHeader = () => {
  return (
    <PageHeader>
      <PageHeader.Start>
        <Breadcrumb>
          <Breadcrumb.List className="gap-1">
            <Breadcrumb.Item>
              <Button variant="ghost" asChild>
                <Link to="/courses/course-category">
                  <IconBook />
                  Ангилалууд
                </Link>
              </Button>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>
        <Separator.Inline />
      </PageHeader.Start>
      <PageHeader.End>
        <CourseCategoryAddDialog />
      </PageHeader.End>
    </PageHeader>
  );
};
