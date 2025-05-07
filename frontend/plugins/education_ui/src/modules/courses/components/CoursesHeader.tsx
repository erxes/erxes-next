import { IconBook } from '@tabler/icons-react';
import { Breadcrumb, Button, PageHeader, Separator } from 'erxes-ui';
import { Link } from 'react-router';
import { CourseAddSheet } from '@/courses/add-course/components/CustomerAddSheet';

export const CoursesHeader = () => {
  return (
    <PageHeader>
      <PageHeader.Start>
        <Breadcrumb>
          <Breadcrumb.List className="gap-1">
            <Breadcrumb.Item>
              <Button variant="ghost" asChild>
                <Link to="/course">
                  <IconBook />
                  Хөтөлбөрүүд
                </Link>
              </Button>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>
        <Separator.Inline />
        <PageHeader.LikeButton />
      </PageHeader.Start>
      <PageHeader.End>
        <CourseAddSheet />
      </PageHeader.End>
    </PageHeader>
  );
};
