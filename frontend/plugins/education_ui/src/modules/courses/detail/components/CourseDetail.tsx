import { Separator, Sheet } from 'erxes-ui';
import { CourseDetailLayout } from '@/courses/detail/components/CourseDetailLayout';
import { CourseDetailGeneral } from '@/courses/detail/components/CourseDetailGeneral';

export const CourseDetail = () => {
  return (
    <CourseDetailLayout>
      <div className="flex flex-auto">
        <Sheet.Content className="border-b-0 rounded-b-none">
          <CourseDetailGeneral />
          <Separator />
        </Sheet.Content>
      </div>
    </CourseDetailLayout>
  );
};
