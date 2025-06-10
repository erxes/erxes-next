import { CourseDetailLayout } from '@/courses/detail/components/CourseDetailLayout';
import { CourseDetailActions } from '@/courses/detail/components/CourseDetailActions';

export const CourseDetail = () => {
  return <CourseDetailLayout actions={<CourseDetailActions />} />;
};
